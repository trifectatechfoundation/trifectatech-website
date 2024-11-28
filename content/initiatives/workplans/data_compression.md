+++

title = "Data compression"
slug = "data-compression"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "/initiatives/data-compression"
backTitle = "Back to initiative: Data compression"
+++

## Data compression projects

Current projects in this initiative include:

- [zlib-rs](#workplan-zlib-rs) - *in progress*
- [bzip2-rs](#workplan-bzip2-rs) - *in progress*
- [zstd](#workplan-zstd) - *pending funding*
- [xz](#workplan-xz) - *pending funding*


## Workplan zlib-rs

Work on zlib-rs is in progress. An audited release [is available](https://github.com/trifectatechfoundation/zlib-rs).  
The project aims to provide a memory-safe implementation of zlib with on-par performance compared to C/C++ counterparts.

### Project status

| status | funding target | funded | 
|---|---|---|
| in progress | &euro; 190.000 | 16% |

We're currently seeking funding for Milestone 3, a stable release. Please get in touch with us via donate@trifectatech.org, if you are interested in financially supporting zlib-rs.

### Future milestones

**Milestone 3: Stable release zlib-rs**

- **On-par performance:** to strengthen our adoption story, we aim to match zlib-ng performance for both compression and decompression. On standard x86_64 processors, we are within a couple percent of this goal. This work item includes completing or implementing SIMD support for the neon (aarch64), and SSE and avx-512 (x86_64) instruction sets.
- **Implementation:** the current zlib-rs project misses some functions that are rarely used in practice, but must be provided to be a proper drop-in replacement. The missing functions are tracked in [this issue](https://github.com/memorysafety/zlib-rs/issues/49).
- **audit** a third party security audit
- **1 year maintenance**
- **Stable release** 

**Milestone 4: Above par performance**

- further performance optimizations
- implementent [improved codegen for state machines](https://github.com/rust-lang/rfcs/pull/3720)

--- 

### Completed milestones

**Milestone 1: Release 0.2.x**

- **Implementation** Implement zlib compression and decompression in pure rust
- **Implementation** `libz-rs` dynamic library that defines an interface identical to `libz`, and is a drop-in replacement for that library.
- **Benchmarking** Benchmarking versus zlib-ng 
- **Integrate** Integrate with [flate2](https://github.com/rust-lang/flate2-rs)

**Milestone 2: Release 0.4.0**

- **Audit:** ISRG audit, fuzzing
- **Benchmarking:** Benchmark on CI (partial). Benchmarking on more architectures versus zlib-ng and zlib-chromium
- **Wasm optimizations:** SIMD optimizations for Webassembly
- **Implementation:** Improvements and fixes

---

## Workplan bzip2-rs

Work on bzip2-rs is in progress. The project aims to provide a memory-safe implementation of bzip2 with on-par performance compared to C/C++ counterparts.

### Project status

| status | funding target | funded | 
|---|---|---|
| in progress | &euro; 30.000 | 100% |

### In-progress milestones

**Milestone 1: Memory-safe bzip2**

- **a rust crate** that implements bzip2 encoding and decoding, and can be integrated with the rust [`bzip2`](https://crates.io/crates/bzip2) crate.
- **a dynamic library:** the `libbz2-rs` dynamic library defines an interface identical to `libbz2`, and is a drop-in replacement for that library. It produces byte-for-byte identical output for identical input.
- **a binary**: the `bzip2` binary is written in safe rust and provides bzip2 (de)compression functionality on the command line. 


### Future milestones

**Milestone 2: On-par performance**

---

## Workplan xz

### XZ milestones

- **a rust crate** that implements multi-threaded compression and decompression, and can be integrated with the rust [`xz2`](https://crates.io/crates/xz2) crate.
- **a dynamic library:** the `liblzma-rs` dynamic library defines an interface identical to `liblzma`, and is a drop-in replacement for that library. 

**Project status "xz"**

| status | funding target | funded | 
|---|---|---|
| pending funding | &euro; 100.000 | 0% |

---

## Workplan zstd

### zstd milestones

- **a rust crate** that implements decompression and multi-threaded compression, and can be integrated with the rust [`zstd`](https://crates.io/crates/zstd) crate.
- **a dynamic library:** the `libzstd-rs` dynamic library defines an interface identical to `libzstd`, and is a drop-in replacement for that library. 

**Project status "zstd"**

| status | funding target | funded | 
|---|---|---|
| pending funding | &euro; 175.000 | 0% |



