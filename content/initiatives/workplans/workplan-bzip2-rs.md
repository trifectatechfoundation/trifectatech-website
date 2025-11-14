+++
title = "Bzip2-rs"
slug = "bzip2-rs"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "projects/bzip2-rs"
backTitle = "Back to project: bzip2-rs"
+++

Bzip2 is in maintenance mode.

### Completed milestones

**Memory-safe bzip2**

- **a rust crate** that implements bzip2 encoding and decoding, and can be integrated with the rust [`bzip2`](https://crates.io/crates/bzip2) crate.
- **a dynamic library:** the `libbz2-rs` dynamic library defines an interface identical to `libbz2`, and is a drop-in replacement for that library. It produces byte-for-byte identical output for identical input.
- **a binary**: the `bzip2` binary is written in safe rust and provides bzip2 (de)compression functionality on the command line. 
- **release of version 0.6.0**

Kindly funded by [NLnet Foundation](https://nlnet.nl/) and the [Ministry of the Interior of the Netherlands](https://www.government.nl/ministries/ministry-of-the-interior-and-kingdom-relations).