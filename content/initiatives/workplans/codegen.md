+++
title = "Make Rust Faster Than C"
slug = "codegen"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "/initiatives/codegen"
backTitle = "Make Rust Faster Than C"
+++

## Workplan

### Milestone 1: Stabilize RFC & create plan   

**Stabilize state machine codegen**

- Work on RFC updates 
- Rust compiler implementation

**Ecosystem research** 

- research the performance challenges in key projects (for example: Rav1d, Servo, RfL, Serde, (TODO: check) NVMe, c2rust)
- in the process: identify projects that can benefit from the state machine RFC

**Performance & MIR optimizations research**

(TODO maybe mention: MIR opts used for compiler opts, not focussed on codegen for rust programs)
(TODO maybe mention: MIR opts overhaul ideas)

- build a knowledge base of current performance optimizations and considerations
- contribute to Rust's documentation of performance optimizations and considerations
- research current state of MIR opts 
- create a plan for Milestone 2

### Milestone 2: MIR optimizations

- prepare a coordinated effort
- implement the plan
- low hanging fruit
- contribute state machine performance improvements to other projects
- create a plan for Milestone 3

### Milstones 3: TODO

TODO work items

TODO Mention: work with the project and ecosystem.