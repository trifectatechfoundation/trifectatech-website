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

- stabilize RFC
- Rust compiler RFC implementation
- identify projects that can benefit from the state machine RFC

Effort: 4 person-weeks

### Milestone 2: Identify performance bottle-necks

- research the performance challenges in key projects (for example: Rav1d, Servo, RfL, Serde, NVMe, c2rust, ripgrep)
- talk to expert project members to document direction and botte-necks
- contribute to Rust's documentation on these topics
- find examples in key projects where the backend optimizes unreliably

Effort: 8 person-weeks

### Milestone 3: Create coordinated plan

Effort: 12-16 person-weeks

### Milestone 4: Execute the plan

- execute the plan
- be faster than C

Effort: 1-2 person-years