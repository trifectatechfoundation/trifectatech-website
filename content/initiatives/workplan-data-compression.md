+++
title = "Work plan Data compression"
slug = "workplan-data-compression"
template = "initiatives/workplans/data-compression.html"
+++

### Workplan data compression

Current projects in this initiative include zlib, bzip2, xz and zstd.

**zlib milestones:**

- **Implement remaining functions:** the current zlib-rs project misses some functions that are rarely used in practice, but must be provided to be a proper drop-in replacement. The missing functions are tracked in [this issue](https://github.com/memorysafety/zlib-rs/issues/49).
- **Performance optimization:** to strengthen our adoption story, we aim to match zlib-ng performance for both compression and decompression. On standard x86_64 processors, we are within a couple percent of this goal. This work item includes completing or implementing SIMD support for the neon (aarch64), and SSE and avx-512 (x86_64) instruction sets.
- **a dynamic library:** the `libz-rs` dynamic library defines an interface identical to `libz`, and is a drop-in replacement for that library.

Target funding `zlib`: &euro; 175.000,-

---

**bzip2 milestones**

- **a rust crate** that implements bzip2 encoding and decoding, and can be integrated with the rust [`bzip2`](https://crates.io/crates/bzip2) crate.
- **a dynamic library:** the `libbz2-rs` dynamic library defines an interface identical to `libbz2`, and is a drop-in replacement for that library. It produces byte-for-byte identical output for identical input.
- **a binary**: the `bzip2` binary is written in safe rust and provides bzip2 (de)compression functionality on the command line. 

Target funding `bzip2`: &euro; 45.000,-

---

**xz milestones:**

- **a rust crate** that implements multi-threaded compression and decompression, and can be integrated with the rust [`xz2`](https://crates.io/crates/xz2) crate.
- **a dynamic library:** the `liblzma-rs` dynamic library defines an interface identical to `liblzma`, and is a drop-in replacement for that library. 

Target funding `xz`: &euro; 100.000,-

---

**zstd milestones:**

- **a rust crate** that implements decompression and multi-threaded compression, and can be integrated with the rust [`zstd`](https://crates.io/crates/zstd) crate.
- **a dynamic library:** the `libzstd-rs` dynamic library defines an interface identical to `libzstd`, and is a drop-in replacement for that library. 

Target funding `zstd`: &euro; 175.000,-

