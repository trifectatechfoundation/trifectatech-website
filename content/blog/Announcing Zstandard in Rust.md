+++
title = "Announcing Zstandard in Rust"
slug = "announcing-zstandard-in-rust"
authors = ["Folkert de Vries"]
date = "2026-05-28"

[taxonomies]
tags = ["libzstd-rs", "announcement"] 

+++

Over the past year we've been silently working on our third compression project. After [zlib](https://github.com/trifectatechfoundation/zlib-rs) and [bzip2](https://github.com/trifectatechfoundation/libbzip2-rs) we're taking on zstd with [libzstd-rs-sys](https://github.com/trifectatechfoundation/libzstd-rs-sys).

<!-- more -->

Zstd is a compression format that has been designed with modern CPUs in mind. It is both much faster and able to compress better than gzip. It is already widely used, and we expect that it will continue to gradually replace gzip for web traffic.

## Why though? 

Using zstd in Rust is already supported via the [zstd](https://crates.io/crates/zstd) crate, so why bother with a whole new implementation?

One practical advantage of Rust is that it is straightforward to write portable software. Currently the `zstd` crate compiles the C code from source, which requires a C toolchain for the target and for the target to be supported at all. Setting up a C toolchain on Windows or for webassembly can be a challenge, and isn't needed with a pure-Rust implementation. For Rust programmers, using dependencies written in Rust is a superior experience.

### Drop-in replacement

Additionally, like with zlib and bzip2, we support compiling `libzstd-rs-sys` into a drop-in compatible C library. Hence we are, or aim to be, an alternative to the C reference implementation. 

### Strengthening the ecosystem

The [C reference implementation](https://github.com/facebook/zstd) is maintained by Meta, and requires signing a contributor agreement with them in order to contribute. We believe that an independent, performant and compatible implementation strengthens the open source ecosystem.

## Current state

The reference implementation was initially translated using [`c2rust`](https://c2rust.com/), and we have since completed the cleanup work for decompression and the dictionary builder. 

We test our rust code (compiled into a C static library) with the the reference implementation's test suite. We additionally use fuzz testing and Miri, so we're confident in the correctness of our implementation.

The release is available here: <TODO: link to release>.

This work has also had ecosystem benefits: we've found several limitations of Miri (that are now resolved) and made contributions to Clippy. A more complete write-up of our recent contributions can be found [here](https://trifectatech.org/blog/fixing-our-own-problems-in-the-rust-compiler/). 

### The cost of memory safety

By default decompression performance of our implementation is a few percent slower than the C reference implementation. We believe we can justify this though, because with the `unsafe-performance-experimental` feature flag enabled we match C performance.

This feature flag disables 4 bounds checks where data from the input is used to index into a data structure. For most users a ~3% performance regression is likely an acceptable price to pay for increased memory safety. If you really need that last bit of performance, you can enable the flag at your own risk. Its behavior matches C which also does not check the bounds and appears to run just fine in many production systems.

## Future

We are looking for funding of the compression portion of this library. 

Because of code sharing between compression and decompression, we have looked at the compression code a bit, but most of the cleanup work still needs to be done. We did set up benchmarks to ensure compression performance does not unexpectedly regress, and as mentioned we already use the reference implementation's test suite to check that we produce the correct result. 

### Ecosystem integration

We have our own fork of the `zstd` that uses `libzstd-rs-sys` instead of the C library. We'd like to upstream this at some point. 

For the most commonly-used APIs this is straightforward. For the `experimental` features we run into some mismatches where `zstd-safe` uses an enum but we must use a `struct` for FFI safety.

## Thanks to our sponsors

The work on the decompression side has been funded by [Chainguard](https://www.chainguard.dev/), [Astral](https://astral.sh/) and [NLnet Foundation](https://nlnet.nl/), and we're grateful for their support! [Sovereign Tech Agency](https://sovereign.tech) invested in the dictionary builder; thank you!

---

### About 

[**Trifecta Tech Foundation**](https://trifectatech.org) is a non-profit and a Public Benefit Organisation (501(c)(3) equivalent) that creates open-source building blocks for critical infrastructure software. Our initiatives on data compression, time synchronization, and privilege boundary, impact the digital security of millions of people. If you’d like to support our work, please contact us; see [trifectatech.org/support](https://trifectatech.org/support/).

[**Astral**](https://astral.sh/) builds high-performance developer tools for the Python ecosystem: 
- Ruff, an extremely fast Python linter, written in Rust.
- uv, an extremely fast Python package manager, written in Rust.

Astral's mission is to make the Python ecosystem more productive. Learn more at [astral.sh](https://astral.sh/).

[**NLnet Foundation**](https://nlnet.nl/) is a recognised philanthropic non-profit foundation. The foundation stimulates network research and development in the domain of Internet technology. The articles of association for the NLnet Foundation state: "to promote the exchange of electronic information and all that is related or beneficial to that purpose". The prefered instrument of NLnet is awarding microgrants to small, independent projects supporting independent researchers and developers. Read more on [nlnet.nl](https://nlnet.nl/).

[**Chainguard**](https://www.chainguard.dev/) builds trusted open source software for a secure-by-default stack. We believe in a world where engineering teams move at the speed of innovation, confident that every line of code is secure. We guard open source software from what could go wrong, so engineering teams can build what they want. Read more on [chainguard.dev](https://www.chainguard.dev/)

### Further Information

- [Data compression initiative on Trifecta Tech Foundation](https://trifectatech.org/initiatives/data-compression)
- [libzstd-rs GitHub Repository](https://github.com/trifectatechfoundation/libzstd-rs-sys)

*For inquiries, please contact Erik Jonkers, [contact@trifectatech.org](mailto:contact@trifectatech.org)*
