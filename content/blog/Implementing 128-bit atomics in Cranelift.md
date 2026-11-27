+++
title = "Implementing 128-bit atomics in Cranelift"
slug = "implementing-128-bit-atomics-in-cranelift"
authors = ["Aelin Reidel"]
date = "2026-10-28"

[taxonomies]
tags = ["cranelift", "cg_clif", "rustc_codegen_cranelift"]

+++

The [Cranelift](https://cranelift.dev/)-based code generation backend for rustc, [rustc_codegen_cranelift](https://github.com/rust-lang/rustc_codegen_cranelift), can build most Rust projects just fine, with a few exceptions due to [current limitations](https://github.com/rust-lang/rustc_codegen_cranelift#not-yet-supported), such as incomplete support for [platform-specific intrinsics](https://doc.rust-lang.org/stable/core/arch/index.html). But perhaps the most prominent project that it cannot currently compile is the Rust standard library.

<!-- more -->

Currently, two patches ([1](https://github.com/rust-lang/rustc_codegen_cranelift/blob/81d9867897fac3ccbd26af70eab6c5c6528c6f60/patches/0027-stdlib-128bit-atomic-operations.patch), [2](https://github.com/rust-lang/rustc_codegen_cranelift/blob/81d9867897fac3ccbd26af70eab6c5c6528c6f60/patches/0027-sysroot_tests-128bit-atomic-operations.patch)) are necessary to compile the standard library with Cranelift. This is because Cranelift doesn't support 128-bit atomics on all targets yet. The x86_64 backend [supports them since the end of 2024](https://github.com/bytecodealliance/wasmtime/pull/9459), but notably, AArch64 support was missing at the time and had an [open issue](https://github.com/bytecodealliance/wasmtime/issues/10835) asking to support it since mid-2025.

I was recently tasked with implementing the necessary bits to support 128-bit atomics in the AArch64 backend as part of my starter projects at Trifecta Tech, with the goal to finally get rid of the patches to the Rust standard library.

This post assumes familiarity with atomic operations and memory orderings. I can recommend Mara's book [Rust Atomics and Locks](https://mara.nl/atomics/) if you're looking for an introduction into the topic. It also covers some of the ARM specifics that will be introduced in this post.

## Atomics on ARM

Before digging into the Cranelift codebase, which was at the time uncharted territory for me, I wanted to take the time to understand which instruction sequences I wanted to emit.

Fortunately, ARM publishes the **A**rchitecture **R**eference **M**anual on [its website](https://documentation-service.arm.com/static/6abbec2a6db85c5e6614a4a1?token=). It's a 124MB PDF with over 17,000 pages, but it will come in handy later when we implement new instructions in Cranelift. I'll be referring to version M.d from September 2026.

Atomics on 64-bit ARM are not very different than on other architectures: The base instruction set contains instruction pairs `ldar`/`stlr` (64-bit) and `ldaxp`/`stlxp` (128-bit) that allow us to perform atomic loads and stores. These instructions have acquire/release semantics.

We'll have to implement four operations: load, store, compare-and-swap (CAS) and read-modify-write (RMW). While loads and stores are straightforward, CAS or RMW operations are actually much more complicated. The ARMv8.0 baseline does not provide one single instruction to perform these operations. In ARMv8.1, ARM introduced the [Large System Extensions (LSE)](https://learn.arm.com/learning-paths/servers-and-cloud-computing/lse/intro/), which add various very useful instructions for 64-bit atomic operations. This was later extended in ARMv9.3 with LSE128, which adds limited support for some 128-bit atomic operations.

However, we cannot make use of these extensions because they are not part of the target baseline. Ideally, we would generate better code if the target features for LSE or LSE128 are enabled, but for implementing any kind of support for 128-bit atomics at all, we will need to use less optimal fallbacks.

## Atomics in WASM

Cranelift is written first and foremost for [wasmtime](https://docs.wasmtime.dev/), a WebAssembly runtime. This means that its model of atomics is heavily influenced by WebAssembly's needs. Most importantly, WebAssembly [requires sequentially consistent memory ordering](https://github.com/WebAssembly/threads/blob/main/proposals/threads/Overview.md#atomic-memory-accesses) for atomic memory accesses. This is relevant for us on ARM, because there atomic load instructions instead only have acquire semantics, and atomic stores have release semantics.

All the atomic operations we are going to be implementing have to be implemented sequentially consistent.

## Learning from LLVM

Let's take a look at how LLVM handles this. Ideally, we'll make Cranelift emit the same instructions as LLVM. [Compiler Explorer](https://rust.godbolt.org/) is an incredibly useful tool to see what assembly LLVM outputs for a given snippet of, in this case, Rust code.

All the following examples can be found in [this Compiler Explorer snippet](https://rust.godbolt.org/z/MqrfbToqE). Note the use of `-Ctarget-feature=-outline-atomics`, which forces LLVM to inline the atomic operations.

If we didn't set this flag, LLVM would instead emit calls to helper functions that detect whether LSE is available or not and conditionally make use of LSE if available, and otherwise use a fallback. But these calls hide the assembly that we're after.

Let's look at `add_u128`:

```asm
add_u128:
        mov     x8, x0
.LBB0_1:
        ldaxp   x0, x1, [x8]
        adds    x9, x0, x2
        adc     x10, x1, x3
        stlxp   w11, x9, x10, [x8]
        cbnz    w11, .LBB0_1
        ret
```

This is actually a loop, and it is a common pattern for all the read-modify-write operations (in this case, the "modify" is adding a number to the value).

The loop follows this pattern:

1. Atomically load the value at the memory location and mark it as exclusively accessed (with `ldaxp`)
2. Compute a new value based on the previous value and our operand (`adds`, `adc`)
3. Atomically store the new value to the memory location with exclusive access (`stlxp`)
4. If the store failed to update the value, go to 1. (`cbnz`)

A load with `ldaxp` marks the address as accessed with *exclusive* access, and `stlxp` will only write back the value to memory if no other store to the address was performed in the meantime. If such a store occurred, the store would fail and the entire operation retried thanks to the loop. Overall, this implementation will ensure sequential consistency.

Also worth checking out is how LLVM ensures sequentially consistent memory ordering for `load_u128`:

```asm
load_u128:
        mov     x8, x0
.LBB4_1:
        ldaxp   x0, x1, [x8]
        stlxp   w9, x0, x1, [x8]
        cbnz    w9, .LBB4_1
        ret
```

It simply attempts to store back the loaded value in a loop. Because it uses the *exclusive* load and store instructions, which use the exclusive monitor on ARM CPUs, we establish a single total modification order with the other sequentially consistent atomic operations.

## Cranelift

Cranelift lives inside the [wasmtime](https://github.com/bytecodealliance/wasmtime/) monorepository, and fortunately we'll mostly be working with a very small part of the wasmtime codebase, all of which except for some tests resides inside the [cranelift/codegen/](https://github.com/bytecodealliance/wasmtime/tree/main/cranelift/codegen) directory.

As an example, we'll be implementing the 128-bit atomic load, the other operations are quite similar and only require generating slightly more complex instruction sequences.

### Finding a starting point

At first, I didn't really know where to start, so I figured the best approach would be to find the place where atomics are wired up in codegen by making it error. From the top-level `cranelift` directory, running `fd atomic` gave me a bunch of interesting results:

```
...
filetests/filetests/isa/aarch64/atomic-cas.clif
filetests/filetests/isa/aarch64/atomic-rmw-lse.clif
filetests/filetests/isa/aarch64/atomic-rmw.clif
filetests/filetests/isa/aarch64/atomic_load.clif
filetests/filetests/isa/aarch64/atomic_store.clif
...
```

These testcases look very promising.

### Adding a failing test

The tests set a bunch of options at the beginning, for example:

* `test compile precise-output` to specify that this is a codegen test, as opposed to a test that is intended to be run
* `target aarch64` to enable a test for AArch64
* `target aarch64 has_lse` to enable a test for AArch64 and use LSE instructions

What follows are function definitions in CLIF, Cranelift's intermediate representation (IR). For example, `atomic_load.clif` contains the following function:

```llvm
function %atomic_load_i64(i64) -> i64 {
block0(v0: i64):
  v1 = atomic_load.i64 v0
  return v1
}
```

This performs a 64-bit atomic load from the address in `v0` and returns the value read.

The function definition is followed by a comment with the expected output: first the expected VCode[^1] and then the expected assembly. The test runner will check the actual output against this comment, and there is tooling to automatically generate or update the expected output.

```llvm
; VCode:
; block0:
;   ldar x0, [x0]
;   ret
;
; Disassembled:
; block0: ; offset 0x0
;   ldar x0, [x0] ; trap: heap_oob
;   ret
```

So what happens when we just try to use 128-bit atomics?

```llvm
function %atomic_load_i128(i64) -> i128 {
block0(v0: i64):
  v1 = atomic_load.i128 v0
  return v1
}
```

Let's run the test:

```bash
$ cargo run -p cranelift-tools -- test filetests/filetests/isa/aarch64/atomic_load.clif
[2026-10-26T15:48:45Z ERROR cranelift_filetests::concurrent] FAIL: compile
FAIL filetests/filetests/isa/aarch64/atomic_load.clif: compile

Caused by:
    Unsupported feature: should be implemented in ISLE: inst = `v1 = atomic_load.i128 v0`, type = `Some(types::I128)`
1 tests
Error: 1 failure
```

The error is expected, but it even tells us what to do! Presumably, we need to teach Cranelift what to do when it encounters an `atomic_load` instruction with a type of `i128`.

### ISLE lowerings

Let's try to look for the code that handles the `atomic_load` instruction:

```bash
$ rg atomic_load src/isa/aarch64/
src/isa/aarch64/lower.isle
1326:(rule 1 (lower (uextend (fits_in_64 out) x @ (and (value_type in) (atomic_load _ (little_or_native_endian flags) _))))
1328:      (load_acquire in flags (sink_atomic_load mem_op)))
2385:(rule (lower (atomic_load (valid_atomic_transaction ty) (little_or_native_endian flags) addr))

...
```

That looks promising! Specifically, `lower.isle` around line 2385:

```clojure
;;;; Rules for `AtomicLoad` ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(rule (lower (atomic_load (valid_atomic_transaction ty) (little_or_native_endian flags) addr))
      (load_acquire ty flags addr))
```

What we're looking at here is ISLE, which stands for "Instruction Selection Lowering Expressions". There's a great introduction to ISLE that can be found [here](https://github.com/bytecodealliance/wasmtime/blob/main/cranelift/isle/docs/language-reference.md), but at the time, I didn't read it and we don't need to know a lot about it other than: it's a LISP-flavored DSL for term rewriting.

Specifically, this ISLE expression tells Cranelift that `atomic_load` should be rewritten to `load_acquire`, provided that the type `ty` is a `valid_atomic_transaction`.

But what does `load_acquire` then get rewritten to? The answer can be found in `inst.isle`:

```clojure
;; Helper for emitting `MInst.LoadAcquire` instructions.
(decl load_acquire (Type MemFlagsData Reg) Reg)
(rule (load_acquire ty flags addr)
      (let ((dst WritableReg (temp_writable_reg $I64))
            (_ Unit (emit (MInst.LoadAcquire ty dst addr flags))))
        dst))
```

There's a lot going on here. `load_acquire` takes a type, some flags and a register with the address, and returns the value in a register. It allocates a new writable register for storing the result and then emits the `LoadAcquire` instruction to load the value into this register and then finally returns the register.

The `LoadAcquire` instruction definition can be found a bit earlier in the same file:

```clojure
;; Read `access_ty` bits from address `rt`, either 8, 16, 32 or 64-bits, and put
;; it in `rn`, optionally zero-extending to fill a word or double word result.
;; This instruction is sequentially consistent.
(LoadAcquire
  (access_ty Type) ;; I8, I16, I32 or I64
  (rt WritableReg)
  (rn Reg)
  (flags MemFlagsData))
```

From the definition of `LoadAcquire`, it's obvious that it is not a suitable instruction to use for a 128-bit atomic load. For a 64-bit atomic load, one destination register (`rt`) is sufficient, but if we want to perform a 128-bit atomic load and store the result in GPRs, we will need two destination registers.

### Wiring it up

Therefore, we will need to add a new instruction, `LoadAcquire128`. It'll look as follows:

```clojure
;; Read 128 bits from address `rn` and put the lower and upper halves in `rt1` and `rt2`
;; respectively.
;; This instruction is sequentially consistent.
(LoadAcquire128
  (rt1 WritableReg)
  (rt2 WritableReg)
  (rn Reg)
  (scratch WritableReg)
  (flags MemFlagsData))
```

Why do we need `scratch` here? Remember: our implementation of the atomic load must be sequentially consistent. We will use an exclusive load-store loop to guarantee this ordering. `scratch` is a register we will use to hold the success status of the store operation, its value before and after the instruction has no meaning.

We'll also need a helper for emitting the instruction in CLIF:

```clojure
;; Helper for emitting `MInst.LoadAcquire128` instructions.
(decl load_acquire_128 (MemFlagsData Reg) ValueRegs)
(rule (load_acquire_128 flags addr)
      (let ((dst_lo WritableReg (temp_writable_reg $I64))
            (dst_hi WritableReg (temp_writable_reg $I64))
            (scratch WritableReg (temp_writable_reg $I64))
            (_ Unit (emit (MInst.LoadAcquire128 dst_lo dst_hi addr scratch flags))))
        (value_regs dst_lo dst_hi)))
```

Nothing particularly exciting, we allocate the necessary registers and return the resulting loaded value in a pair of GPRs.

Now, we want to make sure that an `atomic_load.i128` gets lowered to `load_acquire_128` rather than `load_acquire`. We can do so by adding a more specific lowering rule:

```clojure
;; Lower 128-bit `atomic_load` through a special case
(rule 1 (lower (atomic_load $I128 (little_or_native_endian flags) addr))
      (load_acquire_128 flags addr))
```

`rule 1` sets the precedence for this rule higher than the one for the smaller atomic loads, which used just `rule` and therefore defaults to precedence `0`.

Attempting to compile Cranelift right after adding this new instruction will fail. We need to teach Cranelift a few things about our instruction before this will compile.

In `src/isa/aarch64/inst/mod.rs`, there's two matches on the `Inst` enum (which gets auto-generated from the ISLE definitions) that need branches for the new instruction. One of them, `print_with_state`, is for pretty-printing it, but the other case needs a bit more careful treatment.

#### regalloc

The register allocator needs to know how the registers are being used by our new Cranelift instruction. The value in `rn` is the address to perform the atomic load from; we will not write to it, so we're going to tell the register allocator that the register is an input that's being used but not written to. `rt1` and `rt2` are the two registers we'll write the value to, so we will tell regalloc that they're getting redefined. Similarly, we don't care about the value of `scratch` at the beginning of the instruction, but we'll be writing to it.

```rust
// fn aarch64_get_operands
Inst::LoadAcquire128 {
    rt1,
    rt2,
    rn,
    scratch,
    ..
} => {
    collector.reg_use(rn);
    collector.reg_def(rt1);
    collector.reg_def(rt2);
    collector.reg_def(scratch);
}
```

A neat thing here is that, in Cranelift, `Writable<Reg>` and `Reg` are separate types, and you can only call `reg_def` with a `Writable<Reg>`. In case you want to convert from `Writable<Reg>` to `Reg`, you can use `Writable::<Reg>::to_reg()`. This prevents some footguns like marking a read-only register as `reg_def`.

#### Emitting instructions

With the necessary term rewriting in place and our instruction wired up to regalloc, we can finally start emitting machine instructions.

Remember, what we want to emit is the following assembly:

```asm
again:
  ldaxp rt1, rt2, [rn]
  stxp scratch, rt1, rt2, [rn]
  cbnz scratch, again
```

The lowering of Cranelift instructions like `LoadAcquire128` is done in the `emit` method in `src/isa/aarch64/inst/emit.rs`.

However, before we can actually start emitting the instruction sequence we saw in Godbolt earlier, we need to implement encodings for `ldaxp` and `stxp`. These instructions so far haven't been used in Cranelift, so we'll need to teach Cranelift how to encode them.

#### Implementing new encodings

Fortunately, the manual has a helpful visualization of the encoding for `ldaxp` (C6.2.196):

![ldaxp encoding](/blog/ldaxp.png)

`sz` can be `0` or `1` for 32-bit or 64-bit parameters respectively. While we're only going to be using it for 64-bit parameters, I opted to support both in `enc_ldaxp` to make it easier to check that the implementation matches the manual.

Therefore, we can implement `enc_ldaxp` as follows:

```rust
fn enc_ldaxp(ty: Type, rt: Writable<Reg>, rt2: Writable<Reg>, rn: Reg) -> u32 {
    let sz = match ty {
        I64 => 0b1,
        I32 => 0b0,
        _ => unreachable!(),
    };
    0b10_0010000_1_1_11111_1_00000_00000_00000
        | (sz << 30)
        | (machreg_to_gpr(rt2.to_reg()) << 10)
        | (machreg_to_gpr(rn) << 5)
        | machreg_to_gpr(rt.to_reg())
}
```

A `Reg` is *any* register — it could, for example, be a virtual register or a fixed physical register. At this stage, it has been assigned a physical (general purpose) register and we can get the encoding of the physical register through `machreg_to_gpr`.

`enc_stxp` is quite similar with only two bits flipped and the `Rs` bits used to encode the register for the status result (in our case, `scratch`).

#### Lowering Cranelift instructions to machine instructions

We can now finally start emitting the machine instructions by adding a new match arm in the `emit` function:

```rust
&Inst::LoadAcquire128 {
    rt1,
    rt2,
    rn,
    scratch,
    flags,
} => {
```

We're going to emit a loop, so we need a label at the start that we can jump back to if the exclusive store failed. We'll call this label `again` and bind it to the current offset:

```rust
let again_label = sink.get_label();

// again:
sink.bind_label(again_label, &mut state.ctrl_plane);
```

We then emit `ldaxp`:

```rust
if let Some(trap_code) = flags.trap_code() {
    sink.add_trap(trap_code);
}

// ldaxp rt1, rt2, [rn]
sink.put4(enc_ldaxp(I64, rt1, rt2, rn));
```

Since `ldaxp` performs a memory access, which may trap, we also add a trap record at the current offset.

`stxp` may also trap and is otherwise similar to emit:

```rust
if let Some(trap_code) = flags.trap_code() {
    sink.add_trap(trap_code);
}

// stxp scratch, rt1, rt2, [rn]
sink.put4(enc_stxp(I64, scratch, rt1.to_reg(), rt2.to_reg(), rn));
```

Note that `stxp` takes `rt1` and `rt2` as `Reg` rather than `Writable<Reg>`, so we need to convert between the two.

And finally, we want to branch to `again` if `scratch` is not zero, so we add a conditional branch to the offset of the `again` label:

```rust
// cbnz scratch, again.
let br_again_offset = sink.cur_offset();
sink.put4(enc_conditional_br(
    BranchTarget::Label(again_label),
    CondBrKind::NotZero(scratch.to_reg(), OperandSize::Size64),
));
sink.use_label_at_offset(br_again_offset, again_label, LabelUse::Branch19);
```

The meaning of `LabelUse::Branch19` here might not be obvious. It tells Cranelift what the branch instruction format is (which then determines where in the instruction the offset should be written to). In the Architecture Reference Manual, we can see that `cbnz` (C6.2.77) encodes the offset as the `imm19` parameter in bits 5 to 23, which corresponds to `LabelUse::Branch19` here.

### Verification

Now that the instruction is wired up everywhere in the codegen backend, we can re-run the test from earlier:

```bash
$ cargo run -p cranelift-tools -- test filetests/filetests/isa/aarch64/atomic_load.clif
[2026-10-28T10:31:27Z ERROR cranelift_filetests::concurrent] FAIL: compile
FAIL filetests/filetests/isa/aarch64/atomic_load.clif: compile

Caused by:
    compilation of function on line 4 does not match
    the text expectation

    --- expected
    +++ actual
    @@ -0,0 +1,13 @@
    +VCode:
    +block0:
    +  mov x5, x0
    +  load_acquire_128 x0, x1, [x5], scratch=x4
    +  ret
    +
    +Disassembled:
    +block0: ; offset 0x0
    +  mov x5, x0
    +  ldaxp x0, x1, [x5] ; trap: heap_oob
    +  stxp w4, x0, x1, [x5] ; trap: heap_oob
    +  cbnz x4, #4
    +  ret


    This test assertion can be automatically updated by setting the
    CRANELIFT_TEST_BLESS=1 environment variable when running this test.

1 tests
Error: 1 failure
```

It lowers the `atomic_load.i128` to the `LoadAcquire128` instruction and emits a sequence of machine instructions that looks correct. However, the test fails because we didn't actually add this as the expected compilation output. Let's bless it:

```bash
$ CRANELIFT_TEST_BLESS=1 cargo run -p cranelift-tools -- test filetests/filetests/isa/aarch64/atomic_load.clif
1 tests
```

:partying_face: The only thing missing now is to actually verify whether this generated code does the right thing. Fortunately, Cranelift also has runtests, which compile the IR with a JIT and execute it.

The runtest for 128-bit atomics is `filetests/filetests/runtests/atomic-128.clif`, which tests whether load, store, CAS and RMW all exhibit correct semantics. However, only one access is performed, so we cannot verify whether we have implemented the atomic semantics correctly. It would only catch egregious logic errors, like loading a wrong value.

```llvm
function %atomic_load(i128) -> i128 {
    ss0 = explicit_slot 16, align=16

block0(v0: i128):
    v3 = stack_addr.i64 ss0
    store.i128 notrap v0, v3
    v1 = stack_addr.i64 ss0
    v2 = atomic_load.i128 v1
    return v2
}
; run: %atomic_load(0) == 0
; run: %atomic_load(-1) == -1
; run: %atomic_load(0x00000000_00000000_FFFFFFFF_FFFFFFFF) == 0x00000000_00000000_FFFFFFFF_FFFFFFFF
; run: %atomic_load(0xFFFFFFFF_FFFFFFFF_00000000_00000000) == 0xFFFFFFFF_FFFFFFFF_00000000_00000000
; run: %atomic_load(0xFEDCBA98_76543210_F7E6D5C4_B3A29180) == 0xFEDCBA98_76543210_F7E6D5C4_B3A29180
; run: %atomic_load(0xA00A00A0_0A00A00A_00A00A00_A00A00A0) == 0xA00A00A0_0A00A00A_00A00A00_A00A00A0
; run: %atomic_load(0xC0FFEEEE_ABCDEF01_DECAFFFF_12345678) == 0xC0FFEEEE_ABCDEF01_DECAFFFF_12345678
```

How the runtest for the atomic load works is that it stores a value to memory non-atomically and then performs the atomic load from the location, asserting that it is the same value that was stored.

Since we don't implement atomic store, CAS or RMW at this point, we can temporarily remove those from the test and run it in QEMU after adding `target aarch64` at the top:

```bash
$ cargo run --target aarch64-unknown-linux-gnu -p cranelift-tools -- test filetests/filetests/runtests/atomic-128.clif
1 tests
```

As expected, it passes. The runtest is not very spectacular for load and store, but we will see how it can be particularly useful for troubleshooting logic errors.

### Debugging

Unfortunately, there are times where not everything goes right the first time. [Alex](https://github.com/alexcrichton/) found that the following snippet would crash:

```llvm
test run
set enable_multi_ret_implicit_sret
target aarch64

function %atomic_load_crashes_callee(i64) -> i128 {
block0(v0: i64):
    v1 = atomic_load.i128 v0
    return v1
}

function %atomic_load_crashes(i128) -> i128 {
    ss0 = explicit_slot 16, align=16
    fn0 = %atomic_load_crashes_callee(i64) -> i128

block0(v0: i128):
    v1 = stack_addr.i64 ss0
    store.i128 notrap v0, v1
    v2 = call fn0(v1)
    return v2
}
; run: %atomic_load_crashes(0) == 0
; run: %atomic_load_crashes(0x1234) == 0x1234
; run: %atomic_load_crashes(0xC0FFEEEE_ABCDEF01_DECAFFFF_12345678) == 0xC0FFEEEE_ABCDEF01_DECAFFFF_12345678
```

Running this test results in a crash with `SIGSEGV`. In order to understand what's going on here, it'd be great if I could just attach a debugger and see which instructions get executed. That sounds easier than it is, but fortunately, [bjorn3](https://github.com/bjorn3) was able to help me do just that.

Setting `PERF_BUILDID_DIR` causes Cranelift's JIT to emit a map file `/tmp/perf-$PID.map` which contains a list of functions, their addresses in memory and their sizes.

```bash
$ PERF_BUILDID_DIR=1 gdb -q --args ../../target/debug/clif-util test ../filetests/filetests/runtests/load_crash.clif
Reading symbols from ../../target/debug/clif-util...
warning: Missing auto-load script at offset 0 in section .debug_gdb_scripts
of file /home/aelin/wasmtime/target/debug/clif-util.
Use `info auto-load python-scripts [REGEXP]' to list them.
```

Let's run the program:

```
(gdb) r
Starting program: /home/aelin/wasmtime/target/debug/clif-util test ../filetests/filetests/runtests/load_crash.clif
[New LWP 11025]
[New LWP 11026]
[New LWP 11027]
[New LWP 11028]
[New LWP 11029]
[New LWP 11030]
[New LWP 11031]
[New LWP 11032]
[New LWP 11033]
[New LWP 11034]
[New LWP 11035]
[New LWP 11036]
[New LWP 11037]
[LWP 11036 exited]
[LWP 11029 exited]
[LWP 11028 exited]
[LWP 11027 exited]
[LWP 11031 exited]
[LWP 11030 exited]
[LWP 11033 exited]
[LWP 11032 exited]
[LWP 11034 exited]
[LWP 11037 exited]
[LWP 11035 exited]

Thread 3 "worker #0" received signal SIGSEGV, Segmentation fault.
[Switching to LWP 11026]
0x0000fffff75cf004 in ?? ()
```

At this point, the map file has been created. Let's take a look:

```
(gdb) !cat /tmp/perf-11019.map
fffff75cf000 10 %atomic_load_crashes_callee
fffff75cf010 30 u0:2
fffff75cf040 38 %atomic_load_crashes
fffff75cf078 34 u0:3
```

Judging by our program counter, we're crashing inside of `%atomic_load_crashes_callee`. Now, with the help of the output from the script, we can inspect which instructions Cranelift has generated for this method:

```
(gdb) disas 0xfffff75cf000, 0xfffff75cf000+0x10
Dump of assembler code from 0xfffff75cf000 to 0xfffff75cf010:
   0x0000fffff75cf000:	ldaxp	x0, x1, [x0]
=> 0x0000fffff75cf004:	stxp	w4, x0, x1, [x0]
   0x0000fffff75cf008:	cbnz	x4, 0xfffff75cf000
   0x0000fffff75cf00c:	ret
End of assembler dump.
```

We're crashing on the `stxp`. That is because `ldaxp` uses `x0` both as the address to load from, but also immediately reuses the register as one of the two destination GPRs to load the value into, which means it no longer contains a valid address for `stxp`.

Remember what we told regalloc about the instruction:

```rust
collector.reg_use(rn);
collector.reg_def(rt1);
collector.reg_def(rt2);
collector.reg_def(scratch);
```

This is actually not entirely correct. The way the register allocator in Cranelift works is that it assumes a `reg_def` is not followed by any uses, i.e. it happens at the very end of the instruction. Therefore, with the current constraints, it would be able to reuse the register assigned to `rn` for any of `rt1`, `rt2` or `scratch`.

The solution here is to mark them as `reg_early_def` instead, which means that the register may be written to before all uses are read. That way it won't overwrite the use of `rn`. With this change (which Alex made in [this commit](https://github.com/bytecodealliance/wasmtime/commit/5afd63588b1f5520391c6a37fc38dfd3ccd607c2), thanks!), this will not overwrite the address register anymore and the test case will pass.

### Upstreaming

Once I was done with the implementation of all the operations, I opened a [pull request](https://github.com/bytecodealliance/wasmtime/pull/14475) to Cranelift with the changes. Timing-wise, this lined up conveniently with the [Cranelift weekly meeting](https://github.com/bytecodealliance/meetings/tree/main/cranelift), which I was able to attend thanks to [bjorn3](https://github.com/bjorn3) who came up with the idea and shared the meeting link with me shortly before.

This turned out to be immensely helpful, because review capacity in wasmtime was very scarce due to a plethora of security issues reported at the time. Fortunately, in the meeting, [Jimmy](https://github.com/theotherjimmy) volunteered to review my PR and it was merged shortly afterwards.

### There's more to do

Quite early while working on this, I realized that AArch64 was not the only backend that was missing a 128-bit atomic implementation; RISC-V and s390x also lacked one. Fortunately, none of the rustc targets for RISC-V set `max_atomic_width` to 128, so the standard library does not expose 128-bit atomic types on these targets.

[The s390x targets however do](https://github.com/rust-lang/rust/blob/41089d07a0a2afc16adfe28a760d94d73d7298a4/compiler/rustc_target/src/spec/targets/s390x_unknown_linux_gnu.rs#L10), so I also implemented the necessary changes for the s390x backend ([1](https://github.com/bytecodealliance/wasmtime/pull/14770), [2](https://github.com/bytecodealliance/wasmtime/pull/14771), [3](https://github.com/bytecodealliance/wasmtime/pull/14809)). For various reasons,[^2] this turned out to be more complicated than I had anticipated, but in the end and after another very helpful Cranelift weekly meeting, we managed to find a solution that works.

### The result

128-bit atomic support for AArch64 and s390x shipped in [Cranelift 0.138](https://github.com/bytecodealliance/wasmtime/releases/tag/v51.0.0), and rustc_codegen_cranelift is [now](https://github.com/rust-lang/rustc_codegen_cranelift/pull/1725) finally able to compile the standard library without patches.

I'd like to thank the bytecodealliance folks for being so welcoming to new contributors — I was able to spontaneously hop in a meeting with a bunch of people, ask various questions, get valuable feedback and found a very kind reviewer for my changes. And all of this even though they were flooded with work. Cranelift is an excellent project to hack on and get started with!

---

[^1]: VCode is a control-flow graph of lowered Cranelift instructions, which are quite similar to machine instructions and usually map 1:1 to them, but not always. A notable exception would be the `LoadAcquire128` instruction that we add later, which maps to multiple instructions on machine level.
[^2]: For those curious: Contrary to the other targets, the s390x ABI passes 128-bit integers indirectly. When such a parameter is used, Cranelift automatically emits a load. Due to Cranelift's API, this load can only be performed into a vector register. We opted to keep 128-bit integers entirely in vector registers to simplify things and make it more performant. More details can be found [here](https://github.com/bytecodealliance/wasmtime/pull/14770#issue-5865550225).
