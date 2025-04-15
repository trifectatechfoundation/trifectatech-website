+++
title = "SIMD in zlib-rs (part 1): Autovectorization and target features"
slug = "simd-in-zlib-rs-part-1-autovectorization-and-target-features"
authors = ["Folkert de Vries"]
date = "2025-04-15"

[taxonomies]
tags = ["zlib-rs", "simd"] 

+++

I'm fascinated by the creative use of SIMD instructions. When you first learn about SIMD, it is clear that doing more multiplications in a single instruction is useful for speeding up matrix multiplication. But how can all of these weird instructions be used to solve problems that aren't just arithmetic?

<!-- more -->

*This article was originally posted on the [Tweede golf blog](https://tweedegolf.nl/en/blog/153/simd-in-zlib-rs-part-1-autovectorization-and-target-features). Tweede golf backs Trifecta Tech Foundation's open-source infrastructure projects by contributing effort and code.*

The best way I've found to learn how SIMD can be used is to look at examples, and see how they work and perform. This article is the first in a series of 3 looking at our use of SIMD in [the zlib-rs project](https://github.com/trifectatechfoundation/zlib-rs). We'll look at the instructions, but more so at how we use our understanding of SIMD to speed up the library as a whole.

In this article we'll look at how compilers already use SIMD behind the scenes, how we can determine whether the compiler is doing a good job, and how to gracefully upgrade to faster implementations of a function if the current CPU has additional capabilities.

## Why SIMD?

When it got harder to keep up with Moore's law and keep executing more instructions per second, CPU vendors got clever: if we can't execute more instructions per second, let's instead make each individual instruction perform more work. That way, CPUs can continue to get more useful computation done in the same amount of time.

The result is SIMD: single instruction, multiple data. Instead of one instruction performing one addition, we instead use one instruction that performs 8 additions. In the best case, that instruction yields an eightfold speedup. In practice the speedup is often a bit less than that theoretical maximum, but still fairly significant.

While it would be possible to perform SIMD with a (now) standard 64-bit register (and there are some examples of this "simd within a register" or SWAR idea), generally SIMD uses (much) wider registers. The earliest iterations added 128-bit registers, and later some architectures added even wider registers. These wider registers have an obvious advantage: they allow ever more work to be done by a single instruction. But wider registers are also complicated in terms of CPU design, and are only useful when you can actually keep them busy, which is why the width seems to have maxed out at 512-bit registers for now.

Now it would be great if compilers could use these registers, and they do. However, most programs are not written with SIMD in mind. Hence the compiler has to translate the standard "scalar" program and turn it into a "vectorized" program using the wider registers. It can do so in many basic cases, but SIMD is an area where a dedicated programmer can still outperform the compiler.

## slide hash

[slide_hash.rs](https://github.com/trifectatechfoundation/zlib-rs/blob/main/zlib-rs/src/deflate/slide_hash.rs)

The most basic usage of SIMD in zlib-rs is the `slide_hash_chain` function:

```rust
pub fn slide_hash_chain(table: &mut [u16], wsize: u16) {
    for m in table.iter_mut() {
        *m = m.saturating_sub(wsize);
    }
}
```

Before we start making changes, it's important to see what the compiler already does for this piece of code. To figure that out, there is only one reliable source of truth: look at the assembly. Fluency in assembly is really not required: just being able to skim and recognize the broad strokes is usually sufficient.

We can use [godbolt](https://rust.godbolt.org/) to conveniently inspect the assembly code. Here is the assembly of the main loop:

https://godbolt.org/z/1d6T943Pb

```asm
.LBB0_11:
        movdqu  xmm1, xmmword ptr [rdi + 2*r8]
        movdqu  xmm2, xmmword ptr [rdi + 2*r8 + 16]
        psubusw xmm1, xmm0
        psubusw xmm2, xmm0
        movdqu  xmmword ptr [rdi + 2*r8], xmm1
        movdqu  xmmword ptr [rdi + 2*r8 + 16], xmm2
        add     r8, 16
        cmp     rcx, r8
        jne     .LBB0_11
        cmp     rax, rcx
        je      .LBB0_9
        test    al, 12
        je      .LBB0_14
```

It's not necessary to fully understand this assembly code, but I think there are two important observations:

- The use of `xmm` registers (`xmm0`, `xmm1` and `xmm2`) signals that SIMD is happening. These are 128-bit registers that are available when compiling for `x86_64` targets. 
- The loop has been unrolled, so that 2 128-bit values are processed per loop iteration.

The first 6 instructions represent two loads from memory into a register, two vectorized saturating subtractions, and two stores from a register back to memory. The rest is logic for how to continue with the loop. In godbolt, you can right-click on assembly instructions and view their documentation if you want to know more.

The complete assembly is quite a bit longer than just this inner loop, because it needs to deal with the slice length not dividing neatly into the register width. E.g. if the slice had just 3 elements, a load into an`xmm` register is invalid because it would read out of bounds.

In zlib-rs, we have some additional knowledge about the input: we know that the `table` has a length that is a power of 2 between `2.pow(8)` and `2.pow(16)`. Therefore, we can walk over the data in chunks that nicely fit into one or more vector registers, and don't need to worry about handling trailing elements at the end.

```rust
pub fn slide_hash_chain(table: &mut [u16], wsize: u16) {
    for chunk in table.chunks_exact_mut(32) {
        for m in chunk.iter_mut() {
            *m = m.saturating_sub(wsize);
        }
    }
}
```

Picking a chunk size of 32 elements vectorizes nicely, and overal uses way fewer instructions than the earlier non-chunked version:

https://godbolt.org/z/d9Eb6bMM3

```asm
slide_hash_chain:
        and     rsi, -32
        je      .LBB0_3
        movd    xmm0, edx
        pshuflw xmm0, xmm0, 0
        pshufd  xmm0, xmm0, 0
        xor     eax, eax
.LBB0_2:
        movdqu  xmm1, xmmword ptr [rdi + 2*rax]
        movdqu  xmm2, xmmword ptr [rdi + 2*rax + 16]
        movdqu  xmm3, xmmword ptr [rdi + 2*rax + 32]
        movdqu  xmm4, xmmword ptr [rdi + 2*rax + 48]
        psubusw xmm1, xmm0
        movdqu  xmmword ptr [rdi + 2*rax], xmm1
        psubusw xmm2, xmm0
        movdqu  xmmword ptr [rdi + 2*rax + 16], xmm2
        psubusw xmm3, xmm0
        movdqu  xmmword ptr [rdi + 2*rax + 32], xmm3
        psubusw xmm4, xmm0
        movdqu  xmmword ptr [rdi + 2*rax + 48], xmm4
        add     rax, 32
        cmp     rsi, rax
        jne     .LBB0_2
.LBB0_3:
        ret
```

Apparently, processing 4 128-bit values per iteration is optimal given how many loads and stores can be processed at a time. Fewer and you spend a higher fraction of time on loop bookkeeping, more and you're just growing the size of the binary without any increase in performance. In the godbolt, you can modify the chunk size and see how the generated assembly changes.

## Non-default CPU features

In a better world, that would in fact be the whole implementation.

However, on most x86_64 CPUs, there are even wider registers that the implementation above does not take advantage of. Approximately all machines less than ~10 years old support the 256-bit wide `ymm` registers that are part of the `avx2` feature, and instructions that operate on them.

Our situation is this:

- Newer CPUs have new fancy instructions that we want to use,
- ..but we also want to distribute just one binary to a variety of CPUs with different levels of fancy instruction support.
- Computers really hate executing instructions they don't recognize.

So, here's the plan: we make two versions of our function, a generic one, and one that is able to take advantage of the wider `avx2` registers. We'll then check at runtime whether we can actually use the wider registers, use them if possible, and use the fallback implementation if not:

```rust
#[inline(always)]
fn generic_slide_hash_chain<const N: usize>(table: &mut [u16], wsize: u16) {
    for chunk in table.chunks_exact_mut(N) {
        for m in chunk.iter_mut() {
            *m = m.saturating_sub(wsize);
        }
    }
}

fn slide_hash_chain_fallback(table: &mut [u16], wsize: u16) {
    // 32 means that 4 128-bit values can be processed per iteration. 
    // That appear to be the optimal amount on x86_64 (SSE) and aarch64 (NEON).
    generic_slide_hash_chain::<32>(table, wsize);
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "avx2")]
unsafe fn slide_hash_chain_avx2(table: &mut [u16], wsize: u16) {
    // 64 means that 4 256-bit values can be processed per iteration.
    // That appear to be the optimal amount for avx2.
    generic_slide_hash_chain::<64>(table, wsize);
}
```

The `slide_hash_chain_avx2` is annotated with `#[target_feature(enable = "avx2")]`, which signals to the compiler that the `avx2` registers and instructions may be used in its body. We also mark `generic_slide_hash_chain` as `inline(always)`, so that the ability to use `avx2` transfers to the (now inlined) implementation.

Next, we need to pick the right version when the code is exectuted. In our case, the function is not called that often, and it actually performs a decent amount of work. Therefore the standard approach of branching on whether the feature is detected is acceptable. This is done with one of the `is_*_feature_detected!` macros from the standard library:

```rust
pub fn slide_hash_chain(table: &mut [u16], wsize: u16) {
    #[cfg(target_arch = "x86_64")]
    if core::is_x86_feature_detected!("avx2") {
        // SAFETY: the avx2 feature is available on the current CPU
        return unsafe { slide_hash_chain_avx2(table, wsize) };
    } 

    slide_hash_chain_fallback(table, wsize)
}
```

Calling `is_x86_feature_detected` is relatively slow, but the result is conveniently cached in an atomic value for the duration of the program by the standard library. Still, an atomic read and then a branch on its value is expensive when it's performed too often, so don't do that in hot loops.

When we put all of that into godbolt (https://godbolt.org/z/KjxbErc68), the output now contains a version of `slide_hash_chain` that uses the 128-bit `xmm` registers, and one that uses the 256-bit `ymm` registers, and when executed `slide_hash_chain` will pick the most optimal supported version to call.

## Conclusion

This is a post about SIMD, but so far, no explicit SIMD was written. That is the point: sometimes the compiler actually does your job for you, and it is convenient to make use of it. We used to have custom implementations of `slide_hash_chain` for 128-bit and 256-bit registers, but it turned out the compiler could do it for us with less code and specifically less unsafe code. The compiler even optimizes on platforms that we never wrote dedicated implementations for, like RISC-V.

But explicitly using SIMD is fun, and at times incredibly effective, which is why the next post in this series will focus on explicitly using SIMD to recognize whether two strings are equal.

Zlib-rs is part of Trifecta Tech Foundation's [Data compression initiative](/initiatives/data-compression). Please [contact us](/support) if you are interested in financially supporting zlib-rs.
