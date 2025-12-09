+++
title = "zlib-rs"
slug = "zlib-rs"
template = "projects/project.html"

[extra]
summary = "<p>zlib-rs is an implementation of the widely-used compression library zlib in Rust. It provides excellent performance while introducing memory safety.</p>"

links = [
    { name = "GitHub", href = "https://github.com/trifectatechfoundation/zlib-rs" },
    { name = "Crates", href = "https://crates.io/crates/libz-rs-sys" },
    { name = "Roadmap", href = "#roadmap" },
    { name = "News", href = "#news" },
]

funders = [
    "nlnetfoundation",
    "chainguard",
    "astral",
    "sta"
]

supporters = [
    "devolutions",
    "prossimo",
    "tweedegolf",
    "isrg"
]

blogposts = [
    "Emulating avx-512 intrinsics in Miri",
    "SIMD in zlib-rs (part 2): compare256",
    "SIMD in zlib-rs (part 1): Autovectorization and target features",
    "zlib-rs is faster than C",
    "The fastest WASM zlib",
    "Trifecta Tech Foundation is the new home for memory safe zlib",
    "Current zlib-rs performance",
    "flate2 release v1.0.29 with new `zlib-rs` feature"
]
+++

zlib-rs is an implementation of the widely-used compression library zlib in Rust.
It is available as a drop-in compatible C library and as a Rust crate, and provides excellent performance while adding memory safety.

zlib-rs is part of our [Data compression initiative](/initiatives/data-compression/).

### What we've done

The initial development of `zlib-rs` was started and funded by [Prossimo](https://www.memorysafety.org/initiative/zlib/) and [Tweede golf](https://tweedegolf.nl/en). In 2024, an early release of zlib-rs was [integrated in flate2](https://github.com/rust-lang/flate2-rs/releases/tag/1.0.29) and an audit by [ISRG](https://www.abetterinternet.org/) was succesfully completed. Optimizations for Webassembly were included.

During 2025, zlib-rs was adopted [by 3000+ projects](https://github.com/trifectatechfoundation/zlib-rs/network/dependents) and we achieved our goal of on-par performance, see [/blog/zlib-rs-is-faster-than-c/](https://trifectatech.org/blog/zlib-rs-is-faster-than-c/).

### Roadmap

Work has started on a mature Rust API for zlib-rs that is expected to be released in February 2026. See [the zlib-rs workplan](/initiatives/workplans/zlib-rs) for milestone details.

### Support zlib-rs

Please [get in touch with us](/support), if you are interested in financially supporting us. We offer technical support services for organizations wanting to adopt our data compression software.
