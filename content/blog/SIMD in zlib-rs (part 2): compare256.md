+++
title = "SIMD in zlib-rs (part 2): compare256"
slug = "simd-in-zlib-rs-part-2-compare256"
authors = ["Folkert de Vries"]
date = "2025-05-26"

[taxonomies]
tags = ["zlib-rs", "simd"] 

+++

In [part 1](/blog/simd-in-zlib-rs-part-1-autovectorization-and-target-features) of the "SIMD in zlib-rs" series, we've seen that, with a bit of nudging, autovectorization can produce optimal code for some problems.

But that does not always work: with SIMD clever programmers can still beat the compiler.

<!-- more -->

This time we'll look at a problem where the compiler is not currently capable of using the SIMD capabilities of modern CPUs effectively.

*This article was originally posted on the [Tweede golf blog](https://tweedegolf.nl/en/blog/155/simd-in-zlib-rs-part-2-compare256). Tweede golf backs Trifecta Tech Foundation's open-source infrastructure projects by contributing effort and code.*

## The problem

The problem at hand is the `compare256` function below: given two `[u8; 256]` values, it counts, starting from the left, for how many positions their elements match until there is a mismatch. This function is at the core of the zlib-rs compression algorithm that finds repetitions in the input.

[godbolt.org/z/7nzYKrhrT](https://godbolt.org/z/7nzYKrhrT)

```rust
pub fn compare256(src0: &[u8; 256], src1: &[u8; 256]) -> usize {
    src0.iter().zip(src1).take_while(|(x, y)| x == y).count()
}
```

This function generates the following assembly:

```asm
compare256:
        xor     eax, eax
.LBB0_1:
        movzx   ecx, byte ptr [rdi + rax]
        cmp     cl, byte ptr [rsi + rax]
        jne     .LBB0_6
        movzx   ecx, byte ptr [rdi + rax + 1]
        cmp     cl, byte ptr [rsi + rax + 1]
        jne     .LBB0_3
        movzx   ecx, byte ptr [rdi + rax + 2]
        cmp     cl, byte ptr [rsi + rax + 2]
        jne     .LBB0_4
        movzx   ecx, byte ptr [rdi + rax + 3]
        cmp     cl, byte ptr [rsi + rax + 3]
        jne     .LBB0_5
        add     rax, 4
        cmp     rax, 256
        jne     .LBB0_1
        mov     eax, 256
        ret
.LBB0_3:
        inc     rax
        ret
.LBB0_4:
        add     rax, 2
        ret
.LBB0_5:
        add     rax, 3
.LBB0_6:
        ret
```

No autovectorizaton occurs this time (no `xmm` registers are used), but the compiler did unroll the loop 4 times (processing 4 bytes per iteration) and is reasonably smart about doing the counting.

Altogether not terrible, but we can do much, much better with explicit SIMD.

## The idea 


Let's consider an example using a hypothetical 32-bit SIMD vector. That means we iterate over the input in chunks of 4 8-bit elements, e.g.:

```rust
let src0 = b"abcd"; 
let src1 = b"abce"; 
```

The chunks are loaded into the vector register like so (the chunk is now treated like a number, so the "lower" elements are on the right):

```
[b'd', b'c', b'b', b'a']
[b'e', b'c', b'b', b'a']
```

Next we perform an element-wise equality operation. The output vector contains at each position:

- `0xFF` (all ones in binary) if the elements were equal
- `0x00` (all zeros in binary) if the elements were different

This element-wise equality is the crucial step that non-SIMD code cannot perform elegantly and effciently. For our example, the output is:

```
[0x00, 0xFF, 0xFF, 0xFF]
```

A vector where every element is either `0x00`, or all `0xFF` is called a mask vector. Next, there is an operation to turn this SIMD mask vector into an integer, resulting in:

```
0b0111
```

Finally the `.trailing_ones` method can be used to count how many elements matched before the first one that didn't. For our example it returns 3, and indeed there are 3 matching characters before the first non-matching character.

## Now for real

Next let's actually implement this on the real 128-bit SIMD registers that modern CPUs have. We'll use these imports:

```rust
use core::arch::x86_64::{
    __m128i,
    _mm_cmpeq_epi8,
    _mm_loadu_si128,
    _mm_movemask_epi8,
};
```

- `__m128i` is a 128-bit integer type. It is stored in the `xmm` registers and used by the intrinsics;
- `_mm_loadu_si128` loads an `__m128i` from a pointer;
- `_mm_cmpeq_epi8` performs element-wise equality;
- `_mm_movemask_epi8` converts the output of `_mm_cmpeq_epi8` (a `__m128i`) into a `u16`, with each bit indicating whether the element at that position was equal.

With those ingredients, this is our implementation:

[godbolt.org/z/11z1GavW9](https://godbolt.org/z/11z1GavW9)

```rust
#[target_feature(enable = "sse2,bmi1")]
pub unsafe fn compare256(src0: &[u8; 256], src1: &[u8; 256]) -> usize {
    let src0 = src0.chunks_exact(16);
    let src1 = src1.chunks_exact(16);

    let mut len = 0;

    unsafe {
        for (chunk0, chunk1) in src0.zip(src1) {
            // load the next chunks into a simd register
            let xmm_src0 = _mm_loadu_si128(chunk0.as_ptr() as *const __m128i);
            let xmm_src1 = _mm_loadu_si128(chunk1.as_ptr() as *const __m128i);

            // element-wise compare of the 8-bit elements
            let xmm_cmp = _mm_cmpeq_epi8(xmm_src0, xmm_src1);

            // turn a 16 * 8-bit vector into a 16-bit integer.
            // a bit in the output is set if the corresponding element is non-zero.
            let mask = _mm_movemask_epi8(xmm_cmp) as u16;

            if mask != 0xFFFF /* i.e. all 1 bits */ {
                let match_byte = mask.trailing_ones();
                return len + match_byte as usize;
            }

            len += 16;
        }
    }

    256
}
```

The assembly is too long to include here because the loop is unrolled 16 times, so that the whole 256-byte input is processed without any loop logic. Here is the final part (processing the 16th chunk):

```asm
.LBB0_30:
        movdqu  xmm0, xmmword ptr [rdi + 240]
        movdqu  xmm1, xmmword ptr [rsi + 240]
        pcmpeqb xmm1, xmm0
        pmovmskb        eax, xmm1
        cmp     eax, 65535       ; this is 0xFFFF
        je      .LBB0_34
        mov     ecx, 240
.LBB0_32:
        not     eax
        or      eax, 65536
        tzcnt   eax, eax         ; finds the first zero bit
        or      rax, rcx         ; really this is an add
        ret
.LBB0_34:
        mov     eax, 256
        ret
```

Some observations:

- `_mm_loadu_si128` is lowered to the `movdqu` instruction;
- `_mm_cmpeq_epi8` is lowered as `pcmpeqb`;
- `_mm_movemask_epi8` is lowered as `pmovmskb`, note how its input is `xmm1`(a SIMD register) and its output is `eax` (a standard register);
- When it is safe (no overlapping bits). the compiler will sometimes use a bitwise `or` instead of an `add` instruction.

## Benchmarks

The manual SIMD implementation is extremely effective, and roughly an order of magnitude faster for some simple input.
The benchmark setup can be found [here](https://gist.github.com/folkertdev/0561efe5f779f5b5cd57d14cc57fbe18).

| name                        | fastest    | slowest    | median     | mean       | samples | iters   |
| ---                         | ---        | ---        | ---        | ---        | ---     | ---     |
| compare256_new equal        | `6.745 ns` | `12.22 ns` | `7.374 ns` | `7.408 ns` | `100`   | `51200` |
| compare256_new early return | `4.066 ns` | `4.165 ns` | `4.124 ns` | `4.125 ns` | `100`   | `51200` |
| compare256_old equal        | `45.46 ns` | `85.59 ns` | `45.81 ns` | `48.16 ns` | `100`   | `3200 ` |
| compare256_old early return | `24.28 ns` | `48.53 ns` | `24.35 ns` | `24.59 ns` | `100`   | `12800` |

## Conclusion

This post shows a basic, but very effective, example of a custom SIMD implementation beating the compiler. Examples for other instruction sets (avx2, neon, wasm32) can be found in [compare256.rs](https://github.com/trifectatechfoundation/zlib-rs/blob/main/zlib-rs/src/deflate/compare256.rs).

Next time: given our beautiful hand-crafted SIMD solutions, how do we efficiently pick the right one to use for the actual CPU we're running on?

*Zlib-rs is part of Trifecta Tech Foundation's [Data compression initiative](/initiatives/data-compression). Please [contact us](/support) if you are interested in financially supporting zlib-rs.*