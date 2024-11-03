+++
title = "Data compression"
slug = "data-compression"
template = "initiatives/initiative.html"

[extra]
funders = [
    "devolutions", 
    "prossimo", 
    "chainguard", 
    "tweedegolf", 
    "nlnetfoundation", 
    "ngi-zero-core"
]

blogposts = [
    "Current zlib-rs performance",
    "flate2 release v1.0.29 with new `zlib-rs` feature",
    "xz incident shows the need for structural change"
]
+++

### Building a data compression ecosystem

Compression algorithms are used in a vast number of protocols and file formats throughout all of computing. Implemented in C, these libraries encounter regular security issues despite receiving extensive industry-wide scrutiny.

Our initiative aims to create **memory-safe** implementations of compression libraries:

- **zlib**: a widely-used compression library, used primarily on the web to provide gzip compression to the text/html/js/css we send around.
- **bzip2**: a file compression program that is widely deployed and supported e.g. as part of zip.
- **xz**: a compression format that provides very good compression, but is comparatively slow. Commonly used for large file downloads.
- **zstd**: a modern successor to zlib, providing better compression faster. 

### What We've Done

For zlib, we've created an initial implementation based on zlib-ng, called `zlib-rs`, with a focus on maintaining excellent performance while introducing memory safety. The initial development of `zlib-rs` was started and partly funded by [Prossimo](https://www.memorysafety.org/initiative/zlib/).

In April 2024, an early release of zlib-rs was [integrated in flate2](https://github.com/rust-lang/flate2-rs/releases/tag/1.0.29).

The development of `bzip2` started Oct 2024.

### What's Next

We're currently seeking funding to complete work necessary to make the initial implementation of `zlib` ready for production and to start work on xz and zstd. 

The high level goals for the four projects are:

- provide on-par performance with C/C++ counterparts
- provide a dynamic library that is a drop-in replacement, but has compiled memory-safe rust code inside
- dramatically reduce attack surface through memory safety, improved tooling and a robust build system
- provide a pure rust implementation to rust users that integrates with the existing ecosystem

**Project status "Data compression"**

| status | funding target | funded | 
|---|---|---|
| in progress | &euro; 495.000 | 12% |

### Workplan

For per project details, see [the workplan](/initiatives/workplans/data-compression).

### Links

- [video] [Implementing zlib in Rust](https://www.youtube.com/watch?v=mvzHQdCLkOY&list=PL8Q1w7Ff68DBZZbJt3ie5MUoJV5v2HeA7&index=11)
- [zlib-rs GitHub Repository](https://github.com/memorysafety/zlib-rs/)
- [zlib-rs Prossimo initiative](https://www.memorysafety.org/initiative/zlib/)
