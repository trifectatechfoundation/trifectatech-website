+++
title = "Make Rust Faster Than C"
slug = "codegen"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "initiatives/codegen"
backTitle = "Back to initiative: Making Rust Faster Than C"
+++

## Work plan

### Milestone 1: State machine codegen

- Improve [RFC 3720 (improved state machines)](https://github.com/rust-lang/rfcs/pull/3720)
- Identify key rust projects that benefit from `#[loop_match]` 
- Add experimental support for `#[loop_match]` to [c2rust](https://c2rust.com/)
- Evaluate the improvement by comparing the performance of a freshly translated bzip2 using either the original or patched c2rust

Timeline: Nov 2024 - Jun 2026 
Status: *In progress*. Kindly funded by [NLnet Foundation](https://nlnet.nl/).

### Milestone 3: Tail calls

Guaranteed tail calls and computed goto are techniques used in systems programming to squeeze out the last bit of performance.

- Improve support for guaranteed tail calls
- Add “computed goto” codegen to loop_match
- Improve the loop_match implementation in rustc_codegen_ssa

For more details see the 2026 Rust Project Goal ["Explicit tail calls & loop_match"](https://rust-lang.github.io/rust-project-goals/2026/tail-call-loop-match.html).

Timeline: April 2026 - Dec 2026  
Status: *Needs funding*.

Please [get in touch with us](/support), if you are interested in financially supporting our effort.

## Completed milestones

### Milestone 2: Identify performance bottlenecks

- Complete the [improved state machine codegen](https://github.com/rust-lang/rust-project-goals/issues/258) Rust project goal
- Merge the [`#[loop_match]` language experiment](https://github.com/rust-lang/rust/pull/138780)
- Research the performance challenges in key projects (e.g. rav1d, ripgrep, bzip-rs, zlib-rs, brotli-decompressor)
- Talk to the maintainers of these key project to pinpoint bottlenecks, and to rust team members to find and help document improvements to the backend
- Use c2rust to find small code samples where clang generates better assembly than rustc for (effectively) equivalent input
- Document current cases where rustc generates suboptimal code, or fix the issues, if these are straightforward

Timeline: Apr 2025 - Dec 2025  
Status: *Completed*. Kindly funded by [AWS](https://aws.amazon.com/).


