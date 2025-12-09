+++
title = "Emulating avx-512 intrinsics in Miri"
slug = "emulating-avx-512-intrinsics-in-miri"
authors = ["Folkert de Vries"]
date = "2025-12-09"

[taxonomies]
tags = ["zlib-rs", "simd", "miri"] 

+++

Recently we've started work on using more `avx512` features in [zlib-rs](https://github.com/trifectatechfoundation/zlib-rs).  The `avx512` family of target features provides SIMD intrinsics that use 512-bit vectors (double the size of `avx2`, which uses 256-bit vectors). These wider intrinsics can speed up certain algorithms dramatically.

<!-- more -->

When we first started working on zlib-rs in 2023 many of the `avx512` target features were still unstable, and we didn't have `avx512` hardware to develop on. A couple of years later we have a mature project, more capable hardware, and Rust has stabilized `avx512` target features and intrinsics.

## Algorithms

There are three parts of the zlib-rs codebase that we believe benefit from using `avx512`. The implementations for these are adapted from the [zlib-ng](https://github.com/zlib-ng/zlib-ng) implementation:

- [compare256](https://github.com/trifectatechfoundation/zlib-rs/pull/427) tries to find substring matches
- [crc32](https://github.com/trifectatechfoundation/zlib-rs/pull/422) is the checksum that is used for `.gz`
- [adler32](https://github.com/trifectatechfoundation/zlib-rs/pull/425) is the checksum used in other cases

Often we can clean up the implementation slightly, using slices and iterators. Translating these algorithms to Rust is mostly straightforward.

With the implementation done and validated on real hardware, one issue remained: how do we test this in CI? The standard GitHub CI runners support `avx2`, but not `avx512`,  and we don't particularly want to mess with setting up custom CI machines. 

## Emulation

So the CI hardware does not support `avx512`, but maybe we can emulate the instructions? In CI we're only interested in correct behavior, not in the best performance.  We already use the`qemu` emulator in our CI pipeline to e.g. run our tests for the `s390x-unknown-linux-gnu` target.

Unfortunately, `qemu` does not support `avx512`, apparently not even the simple stuff:

```
qemu-x86_64: warning: TCG doesn't support requested feature: CPUID.07H:EBX.avx512f [bit 16]
qemu-x86_64: warning: TCG doesn't support requested feature: CPUID.07H:EBX.avx512bw [bit 30]
qemu-x86_64: warning: TCG doesn't support requested feature: CPUID.07H:ECX.vpclmulqdq [bit 10]
```

This is actually kind of reasonable: `avx512` is an umbrella term for a large collection of target features that encompasses hundreds of new instructions. That is not very fun to implement.

In the `rust-lang/stdarch` test suite we use the [emulator by intel](https://www.intel.com/content/www/us/en/developer/articles/tool/software-development-emulator.html).  It does support `avx512`, but I know from experience that it is fairly slow, so it's not something I particularly want to use.

So I thought:  we use these `avx512` instructions in SIMD code, code that we'd like to run under Miri anyway. Wouldn't it be nice if Miri could emulate the `avx512` instructions that we need?

## Adding Miri support

Miri already supports many `avx2` instructions, but with `avx512` it runs into the same issue as `qemu`: there are just too many instructions, and implementing them all is not that fun. Luckily, we only need a couple of instructions for zlib-rs, and the Miri code base is quite approachable, so it seemed feasible to just contribute implementations for the instructions that we need.

In the end we needed support for 4 additional instructions, which are all just wider versions of instructions that Miri already supported, so in practice the code is shared with the narrower implementation. We use more than 4 `avx512` instructions, but many of them are about moving values around in memory, and Miri already knows how to do that. The only other interesting instruction, `vpclmulqdq`, was already implemented.

We added the following intrinsics (the links point to the PR/commit  that implements them):

- [`_mm512_sad_epu8`](https://github.com/rust-lang/miri/pull/4686):  the sum of absolute differences. This operation takes two 512-bit vectors as arguments, and interprets the input as two `u8x8x8` matrices, computing the absolute distance between corresponding rows, and then summing that value.
- [`_mm512_ternarylogic_epi32`](https://github.com/rust-lang/miri/pull/4678) : this operation takes 3 vector arguments, goes over the columns one-by-one, and uses the bits in that column as an index into an 8-bit mask. It can implement a variety of logic functions on the 3 bit vectors, like `and`, `xor` or checking whether 2 or more bits were set in the column. 
- [`_mm512_maddubs_epi16`](https://github.com/rust-lang/miri/pull/4705/commits/a11fb5ff4b0cef2df0372ee4293fbfb8679dbaac):  this operation combines a bunch of multiplications and additions into a single instruction.
- [`_mm512_permutexvar_epi32`](https://github.com/rust-lang/miri/pull/4705/commits/760047c3c9b4815764a13baa43218d1e88719c46): a permute that moves elements of a SIMD vector around based on runtime-known indices. Here it was a bit tricky to find a good test case.

For `_mm512_ternarylogic_epi32` the testing in `stdarch` was insufficient to really pin down its behavior, so I also [improved the tests](https://github.com/rust-lang/stdarch/pull/1959) there.

## A detailed look

Let's look at the sum of absolute differences PR in a bit more detail to see the process of supporting a new intrinsic. The PR is [rust-lang/miri#4686](https://github.com/rust-lang/miri/pull/4686).

First we add a new branch to `src/shims/x86/avx512.rs` that matches on the LLVM name of the instruction, checks that we have 2 arguments, and forwards them to a helper. The helper is generic over the input width, so the `avx2` implementation will call the same helper.

```rust
// Used to implement the _mm512_sad_epu8 function.
"psad.bw.512" => {
    this.expect_target_feature_for_intrinsic(link_name, "avx512bw")?;

    let [left, right] =
        this.check_shim_sig_lenient(abi, CanonAbi::C, link_name, args)?;

    psadbw(this, left, right, dest)?
}
```

The generic helpers have the following general structure: there is a comment with a short description, and links to the detailed information about the intrinsics that this function implements. The happy path of the function returns `interp_ok(/* ... */)`

```rust
/// Compute the absolute differences of packed unsigned 8-bit integers
/// in `left` and `right`, then horizontally sum each consecutive 8
/// differences to produce unsigned 16-bit integers, and pack
/// these unsigned 16-bit integers in the low 16 bits of 64-bit elements
/// in `dest`.
///
/// <https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html#text=_mm_sad_epu8>
/// <https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html#text=_mm256_sad_epu8>
/// <https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html#text=_mm512_sad_epu8>
fn psadbw<'tcx>(
    ecx: &mut crate::MiriInterpCx<'tcx>,
    left: &OpTy<'tcx>,
    right: &OpTy<'tcx>,
    dest: &MPlaceTy<'tcx>,
) -> InterpResult<'tcx, ()> {
    let (left, left_len) = ecx.project_to_simd(left)?;
    let (right, right_len) = ecx.project_to_simd(right)?;
    let (dest, dest_len) = ecx.project_to_simd(dest)?;

    // actual implementation

    interp_ok(())
}
```

Then in this case the implementation starts with validating the input widths. 

```rust
// fn psadbw(a: u8x16, b: u8x16) -> u64x2;
// fn psadbw(a: u8x32, b: u8x32) -> u64x4;
// fn vpsadbw(a: u8x64, b: u8x64) -> u64x8;
assert_eq!(left_len, right_len);
assert_eq!(left_len, left.layout.layout.size().bytes());
assert_eq!(dest_len, left_len.strict_div(8));
```

And finally the actual implementation using Miri's APIs.

```rust
for i in 0..dest_len {
    let dest = ecx.project_index(&dest, i)?;

    let mut acc: u16 = 0;
    for j in 0..8 {
        let src_index = i.strict_mul(8).strict_add(j);

        let left = ecx.project_index(&left, src_index)?;
        let left = ecx.read_scalar(&left)?.to_u8()?;

        let right = ecx.project_index(&right, src_index)?;
        let right = ecx.read_scalar(&right)?.to_u8()?;

        acc = acc.strict_add(left.abs_diff(right).into());
    }

    ecx.write_scalar(Scalar::from_u64(acc.into()), &dest)?;
}
```

Note the use of `strict_{mul, add}` and explicit conversions: Miri wants overflowing arithmetic to fail loudly.

Figuring out what the implementation should be requires some tinkering to properly understand what the target intrinsic does. We try to add test cases that exercise the edge cases, and validate the tests on real hardware.
## Conclusion 

There is something very empowering about being able to improve the compiler and related tooling to fit our needs. In this case we also improve Miri not just by adding intrinsic support, often generalizing the implementations across vector widths, but also by extending the Miri tests. I even found some minor things to fix in `stdarch`.  A very successful little project all around.

The `avx512` implementations are available in the latest [0.5.3](https://github.com/trifectatechfoundation/zlib-rs/releases/tag/v0.5.3) release of [`zlib-rs`](https://crates.io/crates/zlib-rs) and [`libz-rs-sys`](https://crates.io/crates/libz-rs-sys). To actually use the `avx512` algorithms you must use rust 1.89 or later and have to build with the relevant target features enabled, e.g. via `-Ctarget-cpu=native` or `-Ctarget-feature=+avx512vl,+avx512bw`.
## Thanks

To the Miri maintainers and especially Ralf Jung for the thorough review on the PRs.

*[zlib-rs](/projects/zlib-rs) is part of Trifecta Tech Foundation's [Data compression initiative](/initiatives/data-compression). Please [contact us](/support) if you are interested in financially supporting zlib-rs.*