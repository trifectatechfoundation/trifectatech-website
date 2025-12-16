+++

title = "Zstd-rs"
slug = "zstd-rs"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "projects/zstd-rs"
backTitle = "Back to project: Zstd-rs"
+++

Work on zstd started in July 2025. The first milestone is the decompression portion of the library.

Now the decompression is in development, we're seeking funding for the *encoder*. Please [get in touch with us](/support), if you are interested in financially supporting the development of memory-safe zstd.

### In progress milestones

**Milestone 1: Decoder implementation**

This milestone adds API-compatible zstd decompression functionality.

- Initial c2rust translation
- Improving the code quality of the translated code
- Testing & fuzzing
- Deliverable: experimental release of the zstd-rs library (libzstd-rs-sys)

This work is supported by [Chainguard](https://www.chainguard.dev/) and [Astral](https://astral.sh/).

**Milestone 2: dictBuilder**

- Implementation of the dictBuilder feature
- Deliverable: release of the zstd-rs library (libzstd-rs-sys) including the dictBuilder feature

This work is supported by [Sovereign Tech Agency](https://sovereign.tech).

**Milestone 3: Publish decoder**

- Improving the performance of the translated code
- Documentation
- Deliverable: Release of the zstd-rs library (libzstd-rs-sys)
- Deliverable: Publish the crate containing the C interface and a C dynamic library that is API-compatible

This work is supported by [NLnet Foundation](https://nlnet.nl).

---

### Future work

**Milestone 4: Encoder implementation**

This milestone adds API-compatible zstd compression.

- Improving the code quality of the translated code
- Improving the performance of the translated code
- Testing & fuzzing
- Audit
- Create release and publish crates

Please contact us if you are interested in supporting this milestone; see [trifectatech.org/support](https://trifectatech.org/support/). 

---










