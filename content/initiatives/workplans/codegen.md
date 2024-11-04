+++
title = "Make Rust Faster Than C"
slug = "codegen"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "/initiatives/codegen"
backTitle = "Make Rust Faster Than C"
+++

## Workplan

### Milestone 1: State machine codegen

- Merge [RFC 3720 (improved state machines)](https://github.com/rust-lang/rfcs/pull/3720)
- Implement RFC 3720 in the rust compiler
- identify popular rust projects that benefit from RFC 3720

Effort: 4 person-weeks

### Milestone 2: Identify performance bottlenecks

- research the performance challenges in key projects (e.g. Servo, RfL, serde, NVMe driver, c2rust, ripgrep)
- talk to expert project members to document direction and bottlenecks of improving the backend
- find and document examples in key projects where the backend optimizes poorly

Effort: 8 person-weeks

### Milestone 3: Create coordinated plan

Effort: 12-16 person-weeks

### Milestone 4: Execute the plan

- execute the plan
- be faster than C

Effort: 1-2 person-years
