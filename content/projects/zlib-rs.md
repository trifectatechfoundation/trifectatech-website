+++
title = "zlib-rs"
slug = "zlib-rs"
template = "projects/project.html"

[extra]
summary = "<p>zlib is a widely-used compression library, used primarily on the web to provide gzip compression.</p>"

funders = [
    "nlnetfoundation", 
    "chainguard", 
    "astral"
]

supporters = [
    "devolutions", 
    "prossimo", 
    "tweedegolf", 
    "isrg"
]

blogposts = [
    "SIMD in zlib-rs (part 2): compare256",
    "SIMD in zlib-rs (part 1): Autovectorization and target features",
    "zlib-rs is faster than C",
    "The fastest WASM zlib",
    "Trifecta Tech Foundation is the new home for memory safe zlib",
    "Current zlib-rs performance",
    "flate2 release v1.0.29 with new `zlib-rs` feature"
]
+++

zlib is a widely-used compression library, used primarily on the web to provide gzip compression.

Zlib-rs provides excellent performance while introducing memory safety. It is part of our Data compression initiative. 

### What We've Done

The initial development of `zlib-rs` was started and funded by [Prossimo](https://www.memorysafety.org/initiative/zlib/) and [Tweede golf](https://tweedegolf.nl/en).

In April 2024, an early release of zlib-rs was [integrated in flate2](https://github.com/rust-lang/flate2-rs/releases/tag/1.0.29). In Nov 2024 an audit by [ISRG](https://www.abetterinternet.org/) was succesfully completed, and optimizations for Webassembly were included in a [new release](https://github.com/trifectatechfoundation/zlib-rs/releases).

During 2025, zlib-rs was adopted [by many projects](https://github.com/trifectatechfoundation/zlib-rs/network/dependents) and we achieved our goal of on-par performance, see [/blog/zlib-rs-is-faster-than-c/](https://trifectatech.org/blog/zlib-rs-is-faster-than-c/).


### Roadmap

Work has started on a mature Rust API for zlib-rs that is expected to be released in February 2026. See [the zlib-rs workplan](/initiatives/workplans/data-compression) for milestone details.

### Support zlib-rs

TODO: make this an element (desktop: in sidebar?)

Please [get in touch with us](/support), if you are interested in financially supporting us. We offer technical support services for organizations wanting to adopt our data compression software.

### Links

TODO: can be removed when links move to top menu. (video can be moved to news/blog)

- [video] [Implementing zlib in Rust](https://www.youtube.com/watch?v=mvzHQdCLkOY&list=PL8Q1w7Ff68DBZZbJt3ie5MUoJV5v2HeA7&index=11)
- [zlib-rs GitHub Repository](https://github.com/trifectatechfoundation/zlib-rs/)
