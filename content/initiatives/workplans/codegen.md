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

Effort: 4 person-weeks

### Milestone 2: Identify performance bottlenecks

- Research the performance challenges in key projects (e.g. Servo, RfL, serde, NVMe driver, c2rust, rav1d, ripgrep)
- Talk to expert rust project members to document direction and bottlenecks of improving the backend
- Find and document examples in key projects where the backend optimizes poorly

Effort: 6 person-weeks 

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
