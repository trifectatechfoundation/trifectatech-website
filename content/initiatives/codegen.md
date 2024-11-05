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

Rust, being a systems language, should be best in class for performance-critical software. 

While the performance difference with C is small, it currently blocks Rust implementations from being widely adopted. Why go through challenging migration only to end up with a 1% performance drop or with +2% additional battery drain.

Our mission is to make critical infrastructure software safer. Performance considerations must be removed as a blocking counter-argument for adoption in performance-sensitive projects, where the impact is highest.

This initiative exists to contribute to change, to change Rust's performance story with the ultimate goal of making it faster than C.

### What we've done

Our work on [zlib-rs](/initiatives/data-compression/) put us on the path to improving the performance of state machines. Complex state machines are niche but foundational to many programs, such as parsers, interpreters, and networking protocols.

Folkert de Vries wrote an [RFC](https://github.com/rust-lang/rfcs/pull/3720) to improve code generation for state machines and bjorn3 implemented a [proof of concept in the Rust compiler](https://github.com/trifectatechfoundation/rust/tree/labeled-match).

The proof is in the pudding: zlib-rs built using the PoC is **14% faster** in a relevant benchmark.

We want to acknowledge the [work done in the Zig ecosystem](https://github.com/ziglang/zig/pull/21257) that inspired our proposal. We'd also like to extend gratitude to [Tweede golf](https://tweedegolf.nl) for supporting the initial effort.

### What's next

A significant coordinated effort is needed to reach the goal of making Rust faster than C. 

We are working on a plan and seeking funding to support this initiative. Have a look at our [preliminary workplan](/initiatives/workplans/codegen/) or contact us via [rustfasterthanc@trifectatech.org](mailto:rustfasterthanc@trifectatech.org).

Meanwhile, we will continue to work on stabilizing the RFC as a first step in the right direction.

### Links

- [RFC 3720 (improved state machines)](https://github.com/rust-lang/rfcs/pull/3720)
- [PoC RFC 3720 in the rust compiler](https://github.com/trifectatechfoundation/rust/tree/labeled-match) on Trifecta Tech Foundation's Github.



