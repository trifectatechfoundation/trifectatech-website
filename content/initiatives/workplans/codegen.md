+++
title = "Make Rust Faster Than C"
slug = "codegen"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "/initiatives/codegen"
backTitle = "Make Rust Faster Than C"
+++

## Work plan - Phase 1

### Milestone 1: State machine codegen

- Merge [RFC 3720 (improved state machines)](https://github.com/rust-lang/rfcs/pull/3720)
- Implement RFC 3720 in the rust compiler
- Identify key rust projects that benefit from RFC 3720
- Add experimental support for RFC 3720 to [c2rust](https://c2rust.com/)
- Evaluate the improvement by comparing the performance of a freshly translated bzip2 using either the original or patched c2rust

Timeline: Nov 2024 - Mar 2025  
Status: *In progress*. Kindly funded by [NLnet Foundation](https://nlnet.nl/).

### Milestone 2: Identify performance bottlenecks

- Research the performance challenges in key projects (e.g. Servo, RfL, serde, NVMe driver, c2rust, rav1d, ripgrep)
- Talk to expert rust project members to document direction and bottlenecks of improving the backend
- Use c2rust to find small code samples where clang generates better assembly than rustc for (effectively) equivalent input
- Document current cases where rustc generates suboptimal code, or fix the issues, if these are straightforward

Timeline: Jan 2025 - Mar 2025  
Effort: 6 person-weeks  
Status: *pending funding*

### Milestone 3: Experiments for improved codegen

The documented projects identified in Milestone 2 are cases where the compiler backend could be generating substantially better code. In this milestone we will run experiments to find improvements for code generation for those cases. Our effort will mostly focus on MIR to MIR optimizations and providing more (accurate) information to LLVM.

- file LLVM issues if the issue is really an LLVM one (we suspect that LLVM overfits on clang output today)
- document improvements that are blocked on open questions in rustc
- submit PRs for rustc issues that can be fixed without (much) coordination

Timeline: Apr 2025 - Jun 2025  
Effort: 8 person-weeks  
Status: *pending funding*

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
