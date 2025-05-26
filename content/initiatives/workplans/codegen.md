+++
title = "Make Rust Faster Than C"
slug = "codegen"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "initiatives/codegen"
backTitle = "Back to initiative: Making Rust Faster Than C"
+++

## Work plan - Phase 1

### Milestone 1: State machine codegen

- Improve [RFC 3720 (improved state machines)](https://github.com/rust-lang/rfcs/pull/3720)
- Identify key rust projects that benefit from `#[loop_match]` 
- Add experimental support for `#[loop_match]` to [c2rust](https://c2rust.com/)
- Evaluate the improvement by comparing the performance of a freshly translated bzip2 using either the original or patched c2rust

Timeline: Nov 2024 - Jun 2025  
Status: *In progress*. Kindly funded by [NLnet Foundation](https://nlnet.nl/).

### Milestone 2: Identify performance bottlenecks

- Complete the [improved state machine codegen](https://github.com/rust-lang/rust-project-goals/issues/258) Rust project goal
- Merge the [`#[loop_match]` language experiment](https://github.com/rust-lang/rust/pull/138780)
- Research the performance challenges in key projects (e.g. rav1d, ripgrep, bzip-rs, zlib-rs, brotli-decompressor)
- Talk to the maintainers of these key project to pinpoint bottlenecks, and to rust team members to find and help document improvements to the backend
- Use c2rust to find small code samples where clang generates better assembly than rustc for (effectively) equivalent input
- Document current cases where rustc generates suboptimal code, or fix the issues, if these are straightforward

Timeline: Apr 2025 - Jun 2025  
Effort: 6 person-weeks  
Status: *In progress*. Kindly funded by [AWS](https://aws.amazon.com/).

## Phase 2

The work of Phase 1 will inform the next steps for this effort. We expect phase 2 will focus on high-reward improvements that require a larger, coordinated effort and collaboration.

*We're in the process of gathering input for this phase. This includes understanding prior work and ideas, and balancing expected effort and expected reward. Contact us via [rustfasterthanc@trifectatech.org](mailto:rustfasterthanc@trifectatech.org) if you want to help.*

The steps in organizing this phase include at least:

- Create a coordinated plan
- Get commitment of team members, contributers and backers
- Secure funding
- Execute the plan
- Be faster than C ⚡

Timeline estimate: Oct 2025 - Dec 2026  
Effort estimate: 2 person-years
