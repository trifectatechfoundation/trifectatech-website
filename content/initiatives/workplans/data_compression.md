+++

title = "Data compression workplan"
slug = "data-compression"
template = "initiatives/workplans/data_compression.html"

+++

## Workplan data compression

Current projects in this initiative include zlib, bzip2, xz and zstd.

### zlib


**Stable release zlib-rs**

- **on-par performance:** to strengthen our adoption story, we aim to match zlib-ng performance for both compression and decompression. On standard x86_64 processors, we are within a couple percent of this goal. This work item includes completing or implementing SIMD support for the neon (aarch64), and SSE and avx-512 (x86_64) instruction sets.
- **wasm optimizations:** SIMD optimizations for Webassembly
- **implement remaining functions:** the current zlib-rs project misses some functions that are rarely used in practice, but must be provided to be a proper drop-in replacement. The missing functions are tracked in [this issue](https://github.com/memorysafety/zlib-rs/issues/49).
- **a dynamic library:** the `libz-rs` dynamic library defines an interface identical to `libz`, and is a drop-in replacement for that library.
- **audit** a third party security audit
- **1 year maintenance**
- **first stable release** 

**Project status "stable release"**

| status | funding target | funded | 
|---|---|---|
| in progress | &euro; 190.000 | 16% |

**Other work**

- **above par performance:** further performance optimizations and above par performance

---

### bzip2 milestones

- **a rust crate** that implements bzip2 encoding and decoding, and can be integrated with the rust [`bzip2`](https://crates.io/crates/bzip2) crate.
- **a dynamic library:** the `libbz2-rs` dynamic library defines an interface identical to `libbz2`, and is a drop-in replacement for that library. It produces byte-for-byte identical output for identical input.
- **a binary**: the `bzip2` binary is written in safe rust and provides bzip2 (de)compression functionality on the command line. 

**Project status "bzip2"**

| status | funding target | funded | 
|---|---|---|
| in progress | &euro; 30.000 | 100% |

---

### XZ milestones

- **a rust crate** that implements multi-threaded compression and decompression, and can be integrated with the rust [`xz2`](https://crates.io/crates/xz2) crate.
- **a dynamic library:** the `liblzma-rs` dynamic library defines an interface identical to `liblzma`, and is a drop-in replacement for that library. 

**Project status "xz"**

| status | funding target | funded | 
|---|---|---|
| pending funding | &euro; 100.000 | 0% |

---

### zstd milestones

- **a rust crate** that implements decompression and multi-threaded compression, and can be integrated with the rust [`zstd`](https://crates.io/crates/zstd) crate.
- **a dynamic library:** the `libzstd-rs` dynamic library defines an interface identical to `libzstd`, and is a drop-in replacement for that library. 

**Project status "zstd"**

| status | funding target | funded | 
|---|---|---|
| pending funding | &euro; 175.000 | 0% |



