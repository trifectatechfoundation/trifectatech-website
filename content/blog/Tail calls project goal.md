+++
title = "Rust should have stable tail calls"
slug = "tail-calls-project-goal"
authors = ["Folkert de Vries"]
date = "2026-04-14"

[taxonomies]
tags = ["state machines"] 

+++

Tail calls in Rust have been talked about for a long time, but especially from the outside it looks like very little progress has been made. Let's change that!

<!-- more -->

[Waffle](https://github.com/WaffleLapkin) and I have submitted a [project goal](https://rust-lang.github.io/rust-project-goals/2026/tail-call-loop-match.html) to move explicit tail calls forward in 2026. We're not quite aiming for stabilization this year, but lining things up to hopefully stabilize in 2027.

This project goal needs funding. If guaranteed tail calls or the projects that use them are valuable to you or your team, [get in touch!](/support)

## What are tail calls?

A tail call is a function call that re-uses its caller's stack frame. That means that tail calls can be used for recursion without the risk of a stack overflow. A common place to hear about tail calls is in functional languages, where they are used instead of loops for iteration. However as we'll see the idea is more general and also useful in systems languages.

A function call can only be turned into a tail call when it is in tail position: it must be the last action of the function before it returns.

```rust
fn baz() {
    let x = f(); // not in tail position

    if true {
        return g(); // in tail position
    }

    h() // in tail position
}
```

The compiler will attempt to turn normal calls in tail position into tail calls. But sometimes it is useful, or even required for correctness, to have the compiler guarantee that a particular call is compiled into a tail call (and error when a tail call is not possible). In Rust an explicit tail call uses the `become` keyword:

```rust
#![feature(explicit_tail_calls)]
#![expect(incomplete_features)]

fn foo(a: i32, b: i32) -> i32 {
    become bar(a, b)
}

fn bar(a: i32, b: i32) -> i32 {
    a + b
}
```

Besides being the final action of a function, a tail call can only work when it is compatible with the caller. The caller and callee must agree on e.g. who is responsible for preserving values in registers, and in some cases the caller must provide sufficient space for arguments.  Hence, the use of `become` imposes the same-signature restriction: the caller and callee must have the same signature.

By itself the ability to use tail calls instead of an explicit loop is just a minor syntactic convenience.
But really, especially in low-level languages,  thinking of tail calls as just a different syntax for iteration misses the point.

## Tail calls for efficient codegen

Tail calls are used in low-level libraries because they enable a level of control over the generated code that is otherwise difficult to achieve without literally writing assembly.

The prototypical use case for tail calls in the wild is in defining state machines, e.g. interpreters, lexers or decoders. Efficient state machine implementations look like the (extremely simplified) example below. Each input token gets its own function that manipulates the state. Afterwards, the `dispatch` function reads the next token and jumps to the corresponding function using a jump table:

```rust
#![feature(explicit_tail_calls)]
#![expect(incomplete_features)]

#[derive(Copy, Clone)]
enum Inst { Inc = 0, Dec = 1 }

// A jump table of function pointers.
static TABLE: [fn(&[Inst], u32) -> u32; 2] = [increment, decrement];

fn dispatch(stream: &[Inst], state: u32) -> u32 {
    match stream {
        [inst, rest @ ..] => become TABLE[*inst as usize](rest, state),
        [] => state,
    }
}

fn increment(stream: &[Inst], state: u32) -> u32 {
    become dispatch(stream, state + 1)
}

fn decrement(stream: &[Inst], state: u32) -> u32 {
    become dispatch(stream, state - 1)
}

fn run() {
    let program = &[Inst::Inc, Inst::Inc, Inst::Dec, Inst::Inc];
    assert_eq!(dispatch(program, 0), 2);
}
```

One crucial property of this construction is that the jump table is an inlining barrier: `dispatch` gets inlined into `decrement`, but `decrement` won't itself be inlined into `dispatch`. If we'd write the above without the explicit jump table (with just a `match` on the `inst`), LLVM would still introduce a jump table, but would inline all functions into one body and simplify the control flow into having just one jump.

Normally, inlining is one of the most beneficial optimizations that a compiler can perform,
but for low-level code using tail calls, not inlining has two advantages:

1. the dispatch logic is duplicated in each function. This is beneficial for branch prediction, because the branch predictor uses the address of the jump as part of its prediction. Without inlining, each function has its own jump. With inlining LLVM would simplify the control flow and the jump would be shared, reducing the accuracy of branch prediction.

   Historically this trick of duplicating the jump could give over 10% speedup. Modern branch predictors are much more accurate and the speedup is more in the 2% range these days. See also [this blog post](https://blog.nelhage.com/post/cpython-tail-call/) on benchmarking the CPython interpreter and [this paper](https://inria.hal.science/hal-01100647/document) that it links on "Branch Prediction and the Performance of Interpreters".

2. each small function can be (manually) optimized in isolation, without uncommon paths (e.g. for error handling) degrading the fast path due to sub-optimal register allocation. In general compilers (and humans) are worse at optimizing large functions. See also [this blog post](https://blog.reverberate.org/2021/04/21/musttail-efficient-interpreters.html) on writing a protobuf parser using tail calls.

The output assembly of the example above shows the two functions, starting with the `inc` and `dec` instruction respectively. The remainder of the function is the inlined dispatch logic that uses a `jmp` to a computed address (i.e. not to a compile-time known label).

[https://godbolt.org/z/aEb5qEPMn](https://godbolt.org/z/aEb5qEPMn)

```asm
decrement:
        dec     edx
        test    rsi, rsi
        je      .LBB0_1
        movzx   eax, byte ptr [rdi]
        dec     rsi
        inc     rdi
        mov     rcx, qword ptr [rip + TABLE@GOTPCREL]
        jmp     qword ptr [rcx + 8*rax]
.LBB0_1:
        mov     eax, edx
        ret

increment:
        inc     edx
        test    rsi, rsi
        je      .LBB1_1
        movzx   eax, byte ptr [rdi]
        dec     rsi
        inc     rdi
        mov     rcx, qword ptr [rip + TABLE@GOTPCREL]
        jmp     qword ptr [rcx + 8*rax]
.LBB1_1:
        mov     eax, edx
        ret

TABLE:
        .quad   increment
        .quad   decrement
```

> NOTE: the assembly is complicated by the bounds check on `stream`. In a real example you'd add an additional instruction indicating "end of input", make sure the final stream element is that instruction, and skip the bounds check, see [https://godbolt.org/z/d1eYqe7WT](https://godbolt.org/z/d1eYqe7WT).

To generate efficient assembly it is extremely important that all commonly-used values are passed via, and never leave, registers. Here we're limited by the calling convention that is used for the tail call, and specifically how many argument registers that calling convention has. On most modern platforms you get somewhere between 4 and 8 registers by default, although there are experimental LLVM calling conventions like `preserve_none` and `tailcc` that make more registers available.

Structs with more than 2 fields, like a state machine's state, are generally passed via the stack. You have to extract and pass each field separately to make sure the values stay in registers. Luckily macros [can help](https://github.com/mkeeter/raven/blob/503ca955e4b3cf09e9587b9e744631ed0291f65a/raven-uxn/src/tailcall.rs#L297) to hide most of the boilerplate.

The above hopefully makes the point that for guaranteed tail calls to actually be useful in Rust we don't just want the "don't grow the stack" behavior to use recursion instead of loops, but actually want the indirect call + jump table pattern to work and generate efficient code.

## Lacking target support

So, if tail calls are so useful for writing low-level systems software, why don't we have them yet?

The main issue is lacking backend support. `rustc` relies on LLVM to actually emit tail calls, and in LLVM (and I believe GCC too) each backend (`x86_64`, `aarch64`, `riscv`, etc.) needs to implement tail calls individually. That means support is spotty: some targets don't support tail calls at all, others only support the most basic cases.

My reading is that tail call support started with an MVP that supported just scalars (numbers and pointers) and only as many parameters as there are registers for arguments (a target-specific number). For the kind of code base and programmer that is already optimizing by inspecting the assembly, those are workable constraints. Passing more arguments or more complicated types would mean spilling to the stack, defeating the performance benefits.

For Rust that kind of ad-hoc limitation won't do. Rust attempts to make it straightforward to write portable code, so that programs generally run on `x86_64`, `aarch64`, etc. without their authors really putting any thought into portability. Even running on `wasm32` might just work out of the box, or requires only some minor tweaks.

Rust will not stabilize a feature that breaks (crashes the compiler, miscompiles your code) on some platforms, or when you hold it slightly wrong (too many arguments, too large arguments).

So, we're in a cycle where Rust won't expose a buggy feature to users, and there is no pressure on LLVM to provide portable tail call support.  To break the cycle, LLVM support must be improved. I finally got fed up enough to fix a long-standing miscompilation on `x86_64` recently in [https://github.com/llvm/llvm-project/pull/168956](https://github.com/llvm/llvm-project/pull/168956). The Rust target maintainer for `loongarch` [added similar support](https://github.com/llvm/llvm-project/pull/168506) which I then [modified for the riscv backend](https://github.com/llvm/llvm-project/pull/170547). With these changes there is now fairly broad support, with two known exceptions.

### Webassembly

Webassembly normally cannot perform tail calls: there just isn't an instruction for it. Only with the `tail-call` target feature do tail calls work. This is problematic for Rust, because we don't love making language features conditional on target features.

Apparently the support that does exist with the target feature is also immature, and has [terrible performance](https://www.mattkeeter.com/blog/2026-04-05-tailcal) across interpreters.

### Powerpc

For powerpc tail calls are tricky in theory, and therefore they are not implemented in practice. The problem is that each object (think `.o`) has a special side table, the TOC. The address to the current TOC is stored in a register. The goal of the TOC is, from what I understand, to keep instruction encodings smaller.

Whenever a function in a different object (e.g. a dynamic library) is called, the call sequence will swap out the caller's TOC for the callee's TOC, call the function, and then switch back to the caller's TOC. But, with a tail call, the callee never returns to the caller and restoring the TOC value never happens.

On 64-bit powerpc a direct function call can be promoted to a tail call; on 32-bit powerpc even that does not work.  Hence, somewhat embarrassingly, LLVM is unable to compile the jump table example for both 32-bit and 64-bit powerpc.

#### The long tail of targets

We've checked support on `x86`, `x86_64`, `aarch64`, `arm`, `s390x`, `riscv` and `loongarch`. Together with `wasm32` and `powerpc64le` they constitute the vast majority of Rust compilations. The remaining targets are niche and rarely used in production.

Hence there seems to be rough consensus that we don't need to wait on LLVM support for these targets for shipping guaranteed tail calls. Nevertheless we'd of course love to see that support.

## Rethinking the problem

The narrative I present here is that tail calls are only actually useful for a very narrow set of libraries: those that implement a state machine, where the next states are only known at runtime, and are extremely performance-sensitive. Specifically, I'd argue that tail calls are only worth it if you were going to look at the generated assembly anyway.

In terms of ergonomics, tail calls are a sacrifice: you need to manually pass your state in the available registers, passing large structs as individual fields. Your code is distributed over many tiny functions and not portable, and debugging code using tail calls is a pain. So, are tail calls actually the right solution for the problem?

In C there is an alternative approach for writing efficient state machines, which shares many of the characteristics of tail calls: the [computed goto](https://eli.thegreenplace.net/2012/07/12/computed-goto-for-efficient-dispatch-tables). Maybe Rust should add something similar instead?

The idea here is that you make a jump table not of function pointers, but of labels in your code. Then you use a `goto` to jump to those labels. Like tail calls this approach will duplicate the branching logic, but all jumps are local to a function and hence computed `goto`s are perfectly portable: they are just a syntax for jumps.

A downside is that that you lose out on the ability to manually optimize the assembly output of small functions, but that might be offset by having the ability to store values on the stack across states and thus preventing repeated loads. At least for `zlib-rs`, which has a very large state struct, we found this to be advantageous.

In LLVM a computed `goto` is represented using the `indirectbr` instruction.  Currently `rustc` cannot generate this instruction, but we plan to add it as an extension of `#[loop_match]`. This feature was a [Project Goal](https://rust-lang.github.io/rust-project-goals/2025h1/improve-rustc-codegen.html). I wrote about this earlier in [Improving state machine code generation](https://trifectatech.org/blog/improving-state-machine-code-generation/) . Currently `#[loop_match]` is only useful when the next state is statically known (e.g. state A always transitions to state B or C, or the Error state).

This will continue to be experimental because the major challenge here is picking a syntax. That is not a discussion I'm particularly interested in, so I'd like to develop the backend capability first, show results, and then figure out how to actually express this in the language.

## A path forward

Given all of this background, how do we make progress from here?

Firstly, there are a number of smaller issues to resolve, like supporting `-> impl Trait` and refactoring the tail call validation to occur earlier in the compilation process.

Next we plan to work on tail calls for `extern "Rust"` first, and separate tail calls for other calling conventions into their own feature. For `extern "Rust"` `rustc` fully controls the ABI across platforms. In particular there are cases where the caller in our examples needs to store data into its caller's argument slots. Based on [this thread on the LLVM discourse](https://discourse.llvm.org/t/are-there-abis-which-restrict-the-caller-from-modifying-an-argument-passed-by-reference/89881) that should work for most calling conventions, but focusing on just `extern "Rust"` cuts our scope and is realistically what most users will use anyway.

Next we'd like to work on `rustc` itself being able to codegen direct tail calls: when the callee is known, `rustc` can transform the call into a direct jump (effectively this inlines the call). This approach resolves some of the portability concerns, but  does not support the indirect call + jump table pattern, and hence does not really support serious use of guaranteed tail calls.

Finally there is the more experimental work to add computed `goto`-like functionality to `#[loop_match]`, and to work on a custom `extern "tail"` calling convention that uses LLVM `tailcc` to loosen the same-signature restriction.

## Conclusion

We believe that this work is essential for Rust to continue to deliver on the promise of being a modern systems programming language. That claim means that it must be possible to write extremely efficient programs like parsers (e.g. protobuf) and interpreters (e.g. wasm, python) in Rust without compromising on performance.

To further this work, [Waffle](https://github.com/WaffleLapkin) and I have submitted a [project goal](https://rust-lang.github.io/rust-project-goals/2026/tail-call-loop-match.html), planning to do most of the work in 2026 and aiming for stabilization in 2027. This effort needs funding, so if guaranteed tail calls or the projects that use them are valuable to you or your team, [get in touch](/support)!
