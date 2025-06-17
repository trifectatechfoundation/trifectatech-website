+++
title = "bzip2 crate switches from C to 100% rust"
slug = "bzip2-crate-switches-from-c-to-rust"
authors = ["Folkert de Vries"]
date = "2025-06-17"

[taxonomies]
tags = ["bzip2-rs", "data compression"] 

+++

Today we published `bzip2` version `0.6.0`, which uses our rust implementation of the bzip2 algorithm, `libbz2-rs-sys`, by default. The `bzip2` crate is now faster and easier to cross-compile. 

<!-- more -->

The `libbz2-rs-sys` crate can also be built as a C dynamic library, if you have a C project that would benefit from these improvements.

## Why though?

Why bother working on this algorithm from the 90s that sees very little use today? The thing is that many protocols and libraries still need to support bzip2 to be compliant with their specification, so many project still, deep down in their dependency tree, depend on bzip2. We've used our experience from zlib-rs to modernize the `bzip2`  implementation.

We've previously written about the implementation details of `libbz2-rs-sys` in ["Translating bzip2 with c2rust"](https://trifectatech.org/blog/translating-bzip2-with-c2rust/), now let's look at the benefits of this work.

### Improved performance

Our rust implementation generally outperforms the C implementation, though there are a couple of cases where we only match C performance. We are not aware of any cases where we are substantially slower.

For compression, we are a fair amount faster. For bzip2, the `level` indicates how much working memory is used. It doesn't influence performance by much, and for `sample3.ref` level 1 already allocates more memory than the file is large, so higher levels are irrelevant.

| name                        | c (cpu cycles)     | rust (cpu cycles)  | Δ         |
| --                          | --                 | --                 | --        |
| sample3.ref (level 1)       | `38.51M ±  77.03K` | `33.53M ±  90.52K` | `-14.87%` |
| silesia-small.tar (level 1) | ` 3.43G ±   2.06M` | ` 3.00G ±   6.31M` | `-14.30%` |
| silesia-small.tar (level 9) | ` 3.47G ±   4.86M` | ` 3.17G ±   4.43M` | `- 9.66%` |

For decompression there is a bit more of a spread, but we again see significant speedups across the board.

| name                   | c (cpu cycles)     | rust (cpu cycles)  | Δ         |
| --                     | --                 | --                 | --        |
| sample3.bz2            | ` 2.53M ±  30.08K` | ` 2.42M ±   8.95K` | `- 4.48%` |
| sample1.bz2            | ` 9.63M ±  40.44K` | ` 8.86M ±  10.64K` | `- 8.63%` |
| sample2.bz2            | `20.47M ±  55.28K` | `19.02M ±  36.13K` | `- 7.67%` |
| dancing-color.ps.bz2   | `87.46M ± 481.02K` | `83.16M ± 548.86K` | `- 5.17%` |
| re2-exhaustive.txt.bz2 | ` 1.89G ±  12.29M` | ` 1.76G ±  12.64M` | `- 7.65%` |
| zip64support.tar.bz2   | ` 2.32G ±  12.09M` | ` 2.11G ±  15.42M` | `-10.00%` |

One caveat is that on our macOS benchmark machine we occasionally see some lower numbers for decompression. We are not sure what causes the variance, and measuring performance on macOS in a detailed way has turned out to be difficult (e.g there is no tool like `perf` to automate performance tracking that we could get to work). 

### Enabling cross-compilation

Cross-compilation of a rust project with C dependencies often works out of the box (because the `cc` crate tries to handle it), but when it doesn't the errors can be hard to debug. Similarly linking to system libraries can cause confusing and hard-to-reproduce issues.

For bzip2, compilation to webassembly has long been an issue. By removing the C dependency and using rust code instead, the complications of compiling C just disappear: cross-compilation just works. Also building for windows or android just works. Besides providing a better experience for users, this change is also a major maintenance win.

### Symbols are not exported (by default)

Using a C dependency means that its symbols are exported (so that a rust `extern` block can find them). The exported names can conflict when another dependency declares the same symbols.

By default, `libbz2-rs-sys` does not export its symbols, which means that it will never conflict with other dependencies. If your rust project does need to emit the symbols, there is a feature flag to enable exporting symbols.

### Run tests with miri

Writing a performant bzip2 implementation requires some unsafe code, and replicating the C interface in rust requires a lot more. Luckily we are able to run that code under MIRI.

More importantly, higher-level libraries or applications that use `bzip2` can now run with MIRI as well.

## Audit

The audit found one logic bug (an off-by-one error), and fixed some limitations in our fuzzer.
Beyond that, there were no significant findings (yay!).  We do want to thank the reviewers from [Radically Open Security](https://www.radicallyopensecurity.com/), specifically Christian Reitter, for sharing their fuzzing experience. The full audit report can be found [here](https://github.com/trifectatechfoundation/libbzip2-rs/blob/main/docs/audits/NGICore%20bzip2%20in%20rust%20code%20audit%20report%202025%201.0.pdf).

## Conclusion

The `bzip2` crate is faster now. You can go back to never having to think about it.

### Thanks

- [Alex Crichton](https://github.com/alexcrichton) for sharing maintainership of the `bzip2` crate
- [Radically Open Security](https://www.radicallyopensecurity.com/) for the audit and sharing their expertise
- [NLnet Foundation](https://nlnet.nl/) for funding this work
