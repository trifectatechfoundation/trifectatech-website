+++
title = "zlib-rs in Firefox"
slug = "zlib-rs-in-firefox"
authors = ["Folkert de Vries"]
date = "2026-06-16"

[taxonomies]
tags = ["zlib-rs", "data compression"]

+++

As of [150.0.0](https://www.firefox.com/en-US/firefox/150.0/releasenotes/), Firefox uses zlib-rs for gzip (de)compression. This is very exciting, and has both performance and safety advantages.

We first started talking to Mozilla engineers in summer 2024, and it took 2 years to actually get zlib-rs into production. What took us so long?

<!-- more -->

## Integrating zlib-rs into the Firefox codebase

Switching to zlib-rs is not entirely trivial: we present zlib-rs as a drop-in compatible replacement, but there are some asterisks to this claim. We change the algorithms that are used at the different compression levels (in a way that is consistent with [zlib-ng](https://github.com/zlib-ng/zlib-ng), but inconsistent with stock zlib), so the exact output bytes and output length can change slightly.

The Firefox test suite tested for the exact output bytes in some cases, and for the (rough) output length in more. This is a good fail safe against messing up the compression configuration, but now these tests all needed to be updated.

Firefox also adds a prefix to all symbols: instead of `inflate` it uses `MOZ_Z_inflate` to prevent symbol clashes. We've long supported prefixing the symbol name in various ways, so getting this to work was just a matter of configuration.

So some work was needed, but the changes were straightforward. All seemed well, until...
## Intel CPU bug

We started seeing [crashes](https://bugzilla.mozilla.org/show_bug.cgi?id=1950764). The logs showed that a bounds check had failed that logically couldn't fail. Of course, we're lucky that we even got a bounds check failure; in C you'd just get silent data corruption.

We could not reproduce the issue locally, and as more reports came in, a pattern started to emerge: our implementation triggered the infamous Intel Raptor Lake CPU bug.

This generation of CPUs is plagued by [instability and degradation issues](https://en.wikipedia.org/wiki/Raptor_Lake#Instability_and_degradation_issue). Something in our code was prone to triggering these issues, but of course we had no idea what, or even how to track it down.

Eventually Fabian Giesen wrote ["Oodle 2.9.14 and Intel 13th/14th gen CPUs"](https://fgiesen.wordpress.com/2025/05/21/oodle-2-9-14-and-intel-13th-14th-gen-cpus/), which identifies the problem as a particular instruction used in writing the result of Huffman coding to memory. Zlib also uses Huffman coding, and zlib-rs turned out to also use the offending instruction.

## Fixing the bug

Once you know what to look for, fixing the issue is reasonably straightforward. We had this function:

[https://godbolt.org/z/GjfYdPe3x](https://godbolt.org/z/GjfYdPe3x)

```rust
pub fn push_dist(&mut self, dist: u16, len: u8) {
    let buf = &mut self.buf.as_mut_slice()[self.filled..][..3];
    let [dist1, dist2] = dist.to_le_bytes();

    buf[0] = dist1;
    buf[1] = dist2;
    buf[2] = len;

    self.filled += 3;
}
```

This code is dead simple: we assign three byte values to consecutive indices of an array. But the assembly for this function (with LLVM 22) has this move from `ch` to memory, which is bits 8-15 of the RCX register:

```assembly
mov     byte ptr [rsi + rdi + 1], ch
```

Due to the hardware bug, occasionally this instruction will actually write bits 0-7 instead, causing the crashes we were seeing.

To work around LLVM emitting this particular instruction, we use a tiny bit of unsafe code (LLVM is clever, so this was the simplest way we've found to have it generate the right thing):

```rust
pub fn push_dist(&mut self, dist: u16, len: u8) {
    let buf = &mut self.buf.as_mut_slice()[self.filled..][..3];

    let bytes = dist.to_le_bytes();
    unsafe { buf.as_mut_ptr().cast::<[u8; 2]>().write_unaligned(bytes) }
    buf[2] = len;

    self.filled += 3;
}
```

The fix in Firefox is [here](https://github.com/mozilla-firefox/firefox/commit/711ef51645a2#diff-945832833d688a990ab42ad9c84ce62a5258698d92bbcabbcdaabc2efbbda282). The patch has been [upstreamed](https://github.com/trifectatechfoundation/zlib-rs/pull/520) into zlib-rs and we will continue to carry that patch for the foreseeable future: it's a marginal amount of unsafe that is easily vetted. These are the sacrifices we make to run reliably on a variety of platforms.

It turns out that LLVM 23 no longer emits the offending instruction, although I believe that is serendipitous and not deliberate. When we bump our MSRV to a version that requires LLVM 23 (e.g. for custom allocators and c-variadic functions) we can drop this workaround.

## Results

So why go through all of this trouble? Because zlib-rs is faster. Much faster. Especially on linux x86_64 the speedup is almost silly. These benchmarks from [zlib-py](https://github.com/Rust-for-CPython/zlib-py) compare stock zlib versus zlib-rs:

```
-------------------------------------------------------------------------
  ONE-SHOT DECOMPRESSION
-------------------------------------------------------------------------
Benchmark                   CPython zlib        zlib_py          Speedup
-------------------------------------------------------------------------
decompress   1 KB  level=1        7.1 us         1.3 us     5.66x faster
decompress   1 KB  level=6        7.0 us         2.1 us     3.34x faster
decompress   1 KB  level=9        7.0 us         2.1 us     3.33x faster
decompress  64 KB  level=1      219.4 us         6.8 us    32.50x faster
decompress  64 KB  level=6      218.6 us         7.6 us    28.70x faster
decompress  64 KB  level=9      217.9 us         7.9 us    27.53x faster
decompress   1 MB  level=1       3.41 ms       128.0 us    26.61x faster
decompress   1 MB  level=6       3.42 ms       125.2 us    27.30x faster
decompress   1 MB  level=9       3.33 ms       134.8 us    24.71x faster
decompress  10 MB  level=1      33.95 ms        1.74 ms    19.50x faster
decompress  10 MB  level=6      33.94 ms        1.68 ms    20.16x faster
decompress  10 MB  level=9      33.80 ms        1.74 ms    19.42x faster
```

```
-------------------------------------------------------------------------
  STREAMING DECOMPRESSION
-------------------------------------------------------------------------
Benchmark                    CPython zlib        zlib_py          Speedup
-------------------------------------------------------------------------
stream decompress   1 KB  L6       7.3 us         2.7 us     2.74x faster
stream decompress  64 KB  L6     221.3 us        22.7 us     9.75x faster
stream decompress   1 MB  L6      3.36 ms       309.0 us    10.86x faster
stream decompress  10 MB  L6     33.71 ms        3.79 ms     8.89x faster
```

Compression is also faster, but harder to compare because the difference in compression ratio.

Via these benchmarks we noticed that the speedup is smaller on aarch64 systems, especially those running macOS. It turns out that Apple provides a more optimized zlib dynamic library, which uses inline assembly for some of the most performance-sensitive parts. This made us realize that there are some optimizations that we missed before, and we're now in the process of integrating them.

## Conclusion

Upgrading to zlib-rs should be straightforward, but in this case we encountered the toughest bug we've seen so far. With CPU bugs, there isn't much to go on, and our standard debugging tools are of little value. We spent months not really sure what to do, but now we have a workaround and can finally move forward.

We're very excited about zlib-rs now serving many more users. We want to thank Mozilla, and specifically Mike Hommey and Gabriele Svelto, for the integration work and tracking down and fixing the CPU bug.