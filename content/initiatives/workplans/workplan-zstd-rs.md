+++

title = "Zstd-rs"
slug = "zstd-rs"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "projects/zstd-rs"
backTitle = "Back to project: Zstd-rs"
+++

Work on zstd started in July 2025. The first milestone is the decompression portion of the library.

Now the decompression is in development, we're seeking funding for the encoder. Please [get in touch with us](/support), if you are interested in financially supporting the development of memory-safe zstd.

### In progress milestones

**Milestone 1: Decoder**

- **decoder** Publish a crate to crates.io that contains the C interface, and a C dynamic library for zstd decompression that is API-compatible. 

**Milestone 2: dictBuilder**

- Implementation of the dictBuilder feature
- Deliverable: release of the zstd-rs library (libzstd-rs-sys) including the dictBuilder feature

---

### Future work

**Milestone 3: Encoder**

- **encoder** Adds API-compatible zstd compression.

---










