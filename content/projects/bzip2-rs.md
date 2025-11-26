+++
title = "bzip2-rs"
slug = "bzip2-rs"
template = "projects/project.html"

[extra]
summary = "<p>Tbd</p>"

links = [
    { name = "GitHub", href = "https://github.com/trifectatechfoundation/bzip2-rs" },
    { name = "Crates", href = "https://crates.io/crates/bzip2" },
    { name = "Roadmap", href = "#roadmap" },
    { name = "News", href = "#news" },
]

funders = [
]

supporters = [
    "nlnetfoundation",
    "ngi-zero-core",
    "min-bzk"
]

blogposts = [
    "bzip2 crate switches from C to 100% rust",
    "Translating bzip2 with c2rust"
]
+++

Bzip2 is a file compression program that is widely deployed and supported e.g. as part of zip.

`bzip2-rs` is available as a [drop-in compatible C library](https://github.com/trifectatechfoundation/libbzip2-rs) and via the [bzip2 crate](https://crates.io/crates/bzip2). The implementation was created using [`c2rust`](https://c2rust.com/), and it is now faster than the C original.

bzip2-rs is part of our [Data compression initiative](/initiatives/data-compression/).

### About

The development of **bzip2**, started Oct 2024. We used `c2rust` to translate the original bzip2 C code to Rust.

In June of 2025 we released version 0.6.0 of the bzip2 crate, that uses our 100% Rust implementation, see the blog post [bzip2 crate switches from C to 100% rust](https://trifectatech.org/blog/bzip2-crate-switches-from-c-to-rust/).

Releases are [available on GitHub](https://github.com/trifectatechfoundation/libbzip2-rs?tab=readme-ov-file#how-to-use-libbzip2-rs-in-your-project), and also through the [bzip2 crate](https://crates.io/crates/bzip2) we now maintain.

### Roadmap

No feature development is currently planned. See [the workplan](/initiatives/workplans/bzip2-rs).

### Support us

Please [get in touch with us](/support), if you are interested in financially supporting the data compression initiative.


