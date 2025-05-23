+++
title = "Making Rust faster than C"
slug = "codegen"
template = "initiatives/initiative.html"

[taxonomies]
category = ["ecosystem"]

[extra]

summary = "<p>Our mission is to make critical infrastructure software safer. For that to happen in all relevant areas, performance considerations must be removed as a blocking counter-argument to the memory safe language Rust.</p>"

funders = [
    "tweedegolf", "nlnetfoundation", "ngi-zero-core", "aws"
]

supporters = [
]

blogposts = [
]
+++
Rust, being a systems language, should be best in class for performance-sensitive software. 

While the performance difference with C is small, it currently blocks performance-sensitive Rust implementations from being widely adopted. Why go through a challenging migration only to end up with a 1% performance drop or a 2% additional battery drain?

Our mission is to make critical infrastructure software safer. Performance considerations must be removed as a blocking argument against Rust to achieve this goal.

This initiative exists to contribute to change, to change Rust's performance story with the ultimate goal of making it faster than C.

### What we've done

Our work on [zlib-rs](/initiatives/data-compression/) put us on the path to improving the performance of state machines. Complex state machines are niche but foundational to many programs, such as parsers, interpreters, and networking protocols.

This work has now resulted in [RFC 3720](https://github.com/rust-lang/rfcs/pull/3720), the [improved state machine codegen](https://github.com/rust-lang/rust-project-goals/issues/258) project goal, and a [`#[loop_match]`](https://github.com/rust-lang/rust/pull/138780) language experiment.

This language experiment achieves a **2.7X** speedup on some parsers, and a **7%** speedup in a zlib-rs benchmark. Exact numbers are [here](https://github.com/rust-lang/rust-project-goals/issues/258#issuecomment-2732965199).

We want to acknowledge the [work done in the Zig ecosystem](https://github.com/ziglang/zig/pull/21257) where our idea was taken from fairly directly, and thank [joshtriplett](https://github.com/joshtriplett), [jackh726](https://github.com/jackh726) and folks at the [codegen unconf at GOSIM 2024](https://hackmd.io/@Q66MPiW4T7yNTKOCaEb-Lw/gosim-unconf-rust-codegen) for providing feedback. 

We also thank [Tweede golf](https://tweedegolf.nl) for supporting the initial effort.

### What's next

The improvements of RFC 3720 are only relevant for specific programs, but it shows that there is room for improvement. While outperforming C by 5% might be unlikely, even a shift from -2% to +2% would significantly improve Rust's story and, more importantly, its impact.

The gap with C can be closed if we can better use Rust's advantages over C, i.e., having access to more information about how the compiler can optimize.

A significant coordinated effort is needed to make Rust faster than C; we by no means think that we can do this alone. While a considerable effort, initial investigation indicates this a realistic goal and one where the expected effort is relatively small in comparison to the impact of the outcome.

### Work plan

We are preparing a plan and are seeking both input as well as funding to support our effort for this initiative. Have a look at our [workplan](/initiatives/workplans/codegen/) or contact us via [rustfasterthanc@trifectatech.org](mailto:rustfasterthanc@trifectatech.org).

### Links

- [RFC 3720](https://github.com/rust-lang/rfcs/pull/3720)
- [improved state machine codegen](https://github.com/rust-lang/rust-project-goals/issues/258) project goal
- [`#[loop_match]`](https://github.com/rust-lang/rust/pull/138780) language experiment

<!-- - [PoC RFC 3720 in the rust compiler](https://github.com/trifectatechfoundation/rust/tree/labeled-match) on Trifecta Tech Foundation's Github. -->


