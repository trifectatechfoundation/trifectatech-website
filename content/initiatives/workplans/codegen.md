+++
title = "Make Rust Faster Than C"
slug = "codegen"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "/initiatives/codegen"
backTitle = "Make Rust Faster Than C"
+++

## Work plan - phase 1

### Milestone 1: State machine codegen

- Merge [RFC 3720 (improved state machines)](https://github.com/rust-lang/rfcs/pull/3720)
- Implement RFC 3720 in the rust compiler
- Identify popular rust projects that benefit from RFC 3720
- Add experimental support for this RFC to c2rust 
- Benchmark a freshly translated bzip2: 1) with the original c2rust, 2) the patched c2rust, and measure the result

Timeline: Nov 2024 - Mar 2025 / Effort: 6 person-weeks

### Milestone 2: Identify performance bottlenecks

- Research the performance challenges in key projects (e.g. Servo, RfL, serde, NVMe driver, c2rust, rav1d, ripgrep)
- Talk to expert rust project members to document direction and bottlenecks of improving the backend
- TODO Find, using c2rust experiments, examples in key projects where the backend optimizes poorly
- TODO Document examples in key projects where the backend optimizes poorly

Timeline: Jan 2025 - Mar 2025 / Effort: 6 person-weeks 

### Milestone 3: Experiments for improved codegen

The documented projects identified in Milestone 2 are cases where the compiler backend could be generating substantially better code but isn't. In this milestone we will run experiments to find improvements for code generation for those cases.
TODO Expected areas of work are MIR to MIR optimizations, missing annotations for LLVM, ..., ...

- TODO define, run, benchmark experiments
- TODO diagnose problems, e.g. for LLVM, and submit issues
- TODO create documentation on possible improvements that are blocked by ...
- TODO submit patches for low-hanging fruit improvements

Timeline: Apr 2025 - Jun 2025 / Effort: 8 person-weeks 


## Phase 2 

The work of Phase 1 will inform the next steps for this effort. We expect phase 2 will focus on high-reward improvements that require a larger, coordinated effort and collaboration.

*We're in the process of gathering input for this phase. This includes understanding prior work and ideas, and balancing expected effort and expected reward. Contact us via [rustfasterthanc@trifectatech.org](mailto:rustfasterthanc@trifectatech.org) if you want to help.*

The steps in organizing this phase include at least:

- Create a coordinated plan
- Get commitment of team members, contributers and backers
- Secure funding for execution
- Execute the plan
- Be faster than C ⚡

Timeline estimate: Oct 2025 - Dec 2026  
Effort estimate: 2 person-years
