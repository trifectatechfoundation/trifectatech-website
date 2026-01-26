+++
title = "Data compression"
slug = "data-compression"
template = "initiatives/initiative.html"

[taxonomies]
category = ["infrastructure"]

[extra]
summary = "<p>Almost all content sent over the Internet undergoes data compression using algorithms like zlib and zstd.</p>"

projects = [
    "zlib-rs",
    "zstd-rs",
    "bzip2-rs"
]

funders = [
    "nlnetfoundation", 
    "chainguard", 
    "ngi-zero-core",
    "min-bzk",
    "astral"
]

supporters = [
    "devolutions", 
    "prossimo", 
    "tweedegolf", 
    "isrg"
]

blogposts = [
    "zlib-rs stable API",
    "Emulating avx-512 intrinsics in Miri",
    "bzip2 crate switches from C to 100% rust",
    "SIMD in zlib-rs (part 2): compare256",
    "SIMD in zlib-rs (part 1): Autovectorization and target features",
    "Translating bzip2 with c2rust",
    "zlib-rs is faster than C",
    "The fastest WASM zlib",
    "Trifecta Tech Foundation is the new home for memory safe zlib",
    "Current zlib-rs performance",
    "flate2 release v1.0.29 with new `zlib-rs` feature",
    "xz incident shows the need for structural change"
]
+++

Compression algorithms are used in a vast number of protocols and file formats throughout all of computing. Implemented in C, these libraries encounter regular security issues despite receiving extensive industry-wide scrutiny.

Our initiative creates **memory-safe** implementations of widely-used compression libraries, zlib, Zstandard and bzip2.

The high-level goals for the projects are:

- reduce attack surface through memory safety and improved tooling
- provide on-par performance with C/C++ counterparts
- provide a dynamic library as a drop-in replacement
- provide a pure rust implementation for the existing ecosystem

Please [get in touch with us](/support), if you are interested in financially supporting us. We offer technical support services for organizations wanting to adopt our data compression software.

### What We've Done

For **zlib**, we've created an implementation based on zlib-ng, called [`zlib-rs`](/projects/zlib-rs/). It provides on-par performance and is widely used.

In June 2025 we released a new version of the **bzip2** crate, see [the bzip2 project page](/projects/bzip2/), that uses our 100% Rust implementation, [/blog/bzip2-crate-switches-from-c-to-rust/](https://trifectatech.org/blog/bzip2-crate-switches-from-c-to-rust/).

### What's Next

Development of **zstd** began in July 2025, with the first release of the decoder planned for February 2026. We're currently seeking funding to complete work on the encoder side, see [Zstandard in Rust](/projects/zstd-rs/). 

Meanwhile, work on zlib-rs and bzip2-rs continues to improve the implementations, enhance performance, and expand adoption.

### Roadmap

See the [zlib-rs](/projects/zlib-rs/), [bzip2-rs](/projects/bzip2-rs/) and [Zstandard in Rust](/projects/zstd-rs/) project pages.

Please [get in touch with us](/support), if you are interested in financially supporting our data compression projects.