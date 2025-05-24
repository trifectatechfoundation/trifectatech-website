+++
title = "Making Rust faster than C"
slug = "codegen"
template = "initiatives/initiative.html"

[taxonomies]
category = ["ecosystem"]

[extra]

summary = "<p>Our mission is to make critical infrastructure software safer. We must eliminate performance considerations as a barrier for adoptiong the memory safe languange Rust in order to achieve this goal.</p>"

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

Our mission is to make critical infrastructure software safer. We must eliminate performance considerations as a barrier for adopting Rust in order to achieve this goal. This initiative exists to contribute to change, to change Rust's performance story with the ultimate goal of making it faster than C.

### What we've done

Our work on [zlib-rs](/initiatives/data-compression/) put us on the path to improving the performance of state machines. Complex state machines are niche but foundational to many programs, such as parsers, interpreters, and networking protocols.

This work has now resulted in [RFC 3720](https://github.com/rust-lang/rfcs/pull/3720), the [improved state machine codegen](https://github.com/rust-lang/rust-project-goals/issues/258) project goal, and a [`#[loop_match]`](https://github.com/rust-lang/rust/pull/138780) language experiment. This language experiment achieves a **2.7X** speedup on some parsers, and a **7%** speedup in a zlib-rs benchmark. Exact numbers are [here](https://github.com/rust-lang/rust-project-goals/issues/258#issuecomment-2732965199).

Part of the work in this initiative is a 2025h1 Rust project goal, see [improved state machine codegen](https://github.com/rust-lang/rust-project-goals/issues/258).

### Work plan

Work on milestone 1, *State machine codegen*, and milestone 2, *Identify performance bottlenecks*, is in progress, see our [workplan](/initiatives/workplans/codegen/).

For the next phase we are preparing a plan and seeking funding. Are you interested in supporting our effort to make Rust faster? Contact us via [rustfasterthanc@trifectatech.org](mailto:rustfasterthanc@trifectatech.org).

### Acknowledgements

We want to acknowledge the [work done in the Zig ecosystem](https://github.com/ziglang/zig/pull/21257) where our idea was taken from fairly directly, and thank [joshtriplett](https://github.com/joshtriplett), [jackh726](https://github.com/jackh726) and folks at the [codegen unconf at GOSIM 2024](https://hackmd.io/@Q66MPiW4T7yNTKOCaEb-Lw/gosim-unconf-rust-codegen) for providing feedback. 

We also thank [Tweede golf](https://tweedegolf.nl) for supporting the initial effort, and [NLnet](https://nlnet.nl) and [AWS](https://aws.amazon.com) for funding the milestone 1, *State machine codegen*, and milestone 2, *Identify performance bottlenecks*.

### What's next

The current initial work shows that there is room for improvement. While outperforming C by 5% is unlikely, even a shift from -2% to +2% would significantly improve Rust's story and, more importantly, its impact. We believe the gap with C can be closed if we can better use Rust's advantages over C, i.e., having access to more information about how the compiler can optimize.

In the next phase, a significant coordinated effort is needed to make Rust faster than C. We by no means think that we can do this alone. While a considerable effort, initial investigation indicates this a realistic goal and one where the expected effort is relatively small in comparison to the impact of the outcome.

For this next phase we are preparing a plan and seeking funding. Are you interested in supporting our effort to make Rust faster? Contact us via [rustfasterthanc@trifectatech.org](mailto:rustfasterthanc@trifectatech.org).

### Links

- [RFC 3720](https://github.com/rust-lang/rfcs/pull/3720)
- [improved state machine codegen](https://github.com/rust-lang/rust-project-goals/issues/258) project goal
- [`#[loop_match]`](https://github.com/rust-lang/rust/pull/138780) language experiment

<!-- - [PoC RFC 3720 in the rust compiler](https://github.com/trifectatechfoundation/rust/tree/labeled-match) on Trifecta Tech Foundation's Github. -->


