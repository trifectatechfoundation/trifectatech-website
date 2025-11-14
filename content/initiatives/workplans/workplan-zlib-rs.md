+++

title = "Zlib-rs"
slug = "zlib-rs"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "projects/zlib-rs"
backTitle = "Back to project: zlib-rs"
+++

Work on zlib-rs continues. Please [get in touch with us](/support), if you are interested in financially supporting memory-safe zlib. 

### In progress milestones

**Milestone 3: Rust Interface and Performance Improvements**

- Experiments to improve performance using AVX512 instruction
- Implementation of a Rust interface for zlib-rs
- Deliverable: release of zlib-rs, including the Rust interface

Status: *In progress*.

This work is supported by [Sovereign Tech Agency](https://sovereign.tech).

---

### Future work

**Milestone 4: Audit, packaging and adoption**

- **Implementation of remaining API functions:** implement remaining functions that must be provided to be a complete drop-in replacement, see [this issue](https://github.com/memorysafety/zlib-rs/issues/49)
- **Audit:** a third party security audit
- **One year of maintenance**
- **Packaging & adoption:** support adoption and provide packages for distributions 

Status: *Pending funding*. Requested funding €45.000.

**Milestone 5: Above par performance**

- further performance optimizations
- implementent [improved codegen for state machines](https://github.com/rust-lang/rfcs/pull/3720)

Status: *Pending funding*. Requested funding €30.000.

---

### Completed milestones

**Milestone 1: Release 0.2.x**

- **Implementation** Implement zlib compression and decompression in pure rust
- **Implementation** `libz-rs` dynamic library that defines an interface identical to `libz`, and is a drop-in replacement for that library.
- **Benchmarking** Benchmarking versus zlib-ng 
- **Integrate** Integrate with [flate2](https://github.com/rust-lang/flate2-rs)

*Completed May 2024*

**Milestone 2: Release 0.4.0**

- **Audit:** ISRG audit, fuzzing
- **Benchmarking:** Benchmark on CI (partial). Benchmarking on more architectures versus zlib-ng and zlib-chromium
- **Wasm optimizations:** SIMD optimizations for Webassembly
- **Implementation:** Improvements and fixes

*Completed Nov 2024*



