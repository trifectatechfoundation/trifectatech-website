+++
title = "Make Rust Faster Than C"
slug = "codegen"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "/initiatives/codegen"
backTitle = "Make Rust Faster Than C"
+++

## Draft Work plan

### Milestone 1: State machine codegen

- Merge [RFC 3720 (improved state machines)](https://github.com/rust-lang/rfcs/pull/3720)
- Implement RFC 3720 in the rust compiler
- Identify popular rust projects that benefit from RFC 3720
- Add experimental support for this RFC to c2rust 
- Benchmark a freshly translated bzip2: 1) with the original c2rust 2) the patched c2rust, and measure the result

Effort: 6 person-weeks
Timeline: Jan - Mar

### Milestone 2: Identify performance bottlenecks

- Research the performance challenges in key projects (e.g. Servo, RfL, serde, NVMe driver, c2rust, rav1d, ripgrep)
- Talk to expert rust project members to document direction and bottlenecks of improving the backend
- TODO Find, using c2rust experiments, examples in key projects where the backend optimizes poorly
- TODO Document examples in key projects where the backend optimizes poorly

Effort: 6 person-weeks 
Timeline: Apr - Jun

### Milestone 3: Experiments for improved codegen

TODO The result of Milestone are cases where we could be generating substantially better code but aren't.
TODO In this milestone we will run experiments to improve code generation by the Rust compiler.
TODO Expected areas of work are MIR to MIR optimizations, missing annotations for LLVM, ..., ...

- TODO define, run, benchmark experiments
- TODO diagnose problems, e.g. for LLVM, and submit issues
- TODO create documentation on possible improvements that are blocked by ...
- TODO submit patches for low-hanging fruit improvements

Effort: 8 person-weeks 

## Future work/milestones

### Draft Milestone 3: Create plan

*We're in the process of gathering input to make this milestone more specific. This includes understanding prior work and ideas, and balancing expected effort and expected reward.*

- Create a coordinated plan
- Get commitment of team members, contributers and backers
- Secure funding for execution

Effort estimate: 6-12 person-weeks

### Draft Milestone 4: Execute the plan

- Execute the plan
- Be faster than C

Effort estimate: 1-2 person-years
