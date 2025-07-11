+++

title = "Data compression"
slug = "data-compression"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "initiatives/data-compression"
backTitle = "Back to initiative: Data compression"
+++

## Data compression projects

Current projects in this initiative include:

- [zlib-rs](#workplan-zlib-rs) - *released*
- [zstd](#workplan-zstd) - *in progress*
- [bzip2-rs](#workplan-bzip2-rs) - *released*
- [xz](#workplan-xz) - *pending funding*


## Workplan zlib-rs

An audited release [is available](https://github.com/trifectatechfoundation/zlib-rs). 

Work on zlib-rs continues: we're seeking funding for Milestone 3, that completes our implementation. 
Please [get in touch with us](/support), if you are interested in financially supporting memory-safe zlib. 

We offer technical support services for organizations wanting to adopt zlib-rs.

### Project status

| status | funding target | funded | 
|---|---|---|
| in progress | &euro; 250.000 | 62% |

### Upcoming milestones

**Milestone 3: Performance, packaging and adoption**

- **Performance work:** performance work for various platforms, e.g. algorithmic improvements and using avx512 instruction
- **Implementation of remaining API functions:** implement remaining functions that must be provided to be a complete drop-in replacement, see [this issue](https://github.com/memorysafety/zlib-rs/issues/49)
- **Audit:** a third party security audit
- **One year of maintenance**
- **Packaging & adoption:** support adoption and provide packages for Debian 

Status: *Pending funding*. Requested funding €95.000.

### Future work

**Milestone 4: Above par performance**

- further performance optimizations
- implementent [improved codegen for state machines](https://github.com/rust-lang/rfcs/pull/3720)

See [past milestones](/initiatives/workplans/zlib-completed-milestones).

---

## Workplan zstd

Work on zstd started in July 2025. The first milestone is the decompression portion of the library.

### zstd milestones

- **decoder** Publish a crate to crates.io that contains the C interface, and a C dynamic library for zstd decompression that is API-compatible. 
- **encoder** Adds API-compatible zstd compression.

Now the decompression is in development, we're seeking funding for the encoder. Please [get in touch with us](/support), if you are interested in financially supporting the development of memory-safe zstd.

**Project status "zstd"**

| status | funding target | funded | 
|---|---|---|
| in progress | &euro; 200.000 | 45% |

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

Status: *In progress*. Kindly funded by [NLnet Foundation](https://nlnet.nl/) and the [Ministry of the Interior of the Netherlands](https://www.government.nl/ministries/ministry-of-the-interior-and-kingdom-relations).

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





