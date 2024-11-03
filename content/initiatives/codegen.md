+++
title = "Making Rust faster than C"
slug = "codegen"
template = "initiatives/initiative.html"

[extra]
funders = [
    "tweedegolf"
]

blogposts = [
]
+++

### Making Rust faster than C

Rust, being a systems language, should be best in class for performance-critical software. While the performance difference with C is small, it currenly blocks Rust alternatives from being adopted.

Our mission is to make critical infrastructure software safer. For that to happen in all relevant areas, performance considerations must to be removed as a blocking counter-argument.

This initiative exists to contribute to change; to changing Rust's performance story with the ultimate goal of making it faster than C.

### What we've done

Our work on [zlib-rs](/initiatives/datacompression) led us on the path to improve the performance of state machines. Complex state machines are niche, but foundational to many programs, such as parsers, interpreters and networking protocols.

Folkert de Vries wrote an [RFC](https://github.com/rust-lang/rfcs/pull/3720) to improve code generation for state machines and bjorn3 implemented a [proof of concept in the Rust compiler](https://github.com/trifectatechfoundation/rust/tree/labeled-match).

The proof is in the eating: zlib-rs build using the PoC is **5% faster**.

While we haven't tested other projects, we expect improved codegen is possible for all parsers, interpreters and networking protocols (etc) that make significant use of (TODO: specify type) state machines; in the range of (TODO: realistic range?) 0.5% to 5%.

We want to acknowledge the work done in the Zig ecosystem (todo: link) that inspired our proposal. We'd also like to extend gratitude to [Tweede golf](https://tweedegolf.nl) to support the initial effort. 

### What's next

A coordinated effort is needed to reach the goal of making Rust faster than C. We propose work in this [work plan](/initiatives/workplans/codegen/) and seek funding to support our work.

Meanwhile, we will continue to work on stabilizing the RFC, as a first step in the right direction.

### Links

- [State machine codegen RFC](https://github.com/rust-lang/rfcs/pull/3720)
- [PoC rustc](https://github.com/trifectatechfoundation/rust/tree/labeled-match) on Trifecta Tech Foundation's Github.



