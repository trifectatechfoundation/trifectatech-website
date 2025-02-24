+++

title = "zlib-rs completed milestones"
slug = "zlib-completed-milestones"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "initiatives/data-compression"
backTitle = "Back to initiative: Data compression"
+++

## Completed milestones zlib-rs

**Milestone 1: Release 0.2.x**

- **Implementation** Implement zlib compression and decompression in pure rust
- **Implementation** `libz-rs` dynamic library that defines an interface identical to `libz`, and is a drop-in replacement for that library.
- **Benchmarking** Benchmarking versus zlib-ng 
- **Integrate** Integrate with [flate2](https://github.com/rust-lang/flate2-rs)

*Completed May 2024*

---

**Milestone 2: Release 0.4.0**

- **Audit:** ISRG audit, fuzzing
- **Benchmarking:** Benchmark on CI (partial). Benchmarking on more architectures versus zlib-ng and zlib-chromium
- **Wasm optimizations:** SIMD optimizations for Webassembly
- **Implementation:** Improvements and fixes

*Completed Nov 2024*