+++
title = "zstd-rs"
slug = "zstd-rs"
template = "projects/project.html"

[extra]
summary = "<p>zstd-rs is an implementation of Zstandard, a modern successor to zlib, providing better compression faster.</p>"

links = [
    { name = "GitHub", href = "https://github.com/trifectatechfoundation/libzstd-rs-sys" },
    { name = "Roadmap", href = "#roadmap" },
    { name = "News", href = "#news" },
]

funders = [
    "chainguard", 
    "astral",
    "sta",
    "nlnetfoundation",
    "ngi-zero-core"
]

supporters = [
]

blogposts = [
]
+++

Zstandard is a modern successor to zlib, providing better compression faster. Zstd-rs is *in development*; it aims to provide excellent performance while introducing memory safety.

The project will provide a dynamic library that is a drop-in replacement for C/C++ counterparts, but has compiled memory-safe Rust code inside. 

For the high level goals of our data compression projects, see our [Data compression initiative](/initiatives/data-compression/).

### About

Development of zstd-rs began in July 2025, with the first release of the decoder planned for March 2026.

We thank [Chainguard](https://www.chainguard.dev/), [Astral](https://astral.sh/), [Sovereign Tech Agency](https://sovereign.tech) and [NLnet Foundation](https://nlnet.nl) for their support.

### Roadmap

- 2025 Q3: start of decoder implementation
- 2025 Q4: implementation of dictBuilder feature
- 2026 Q1: release of decoder
- 2026 Q2: start of encoder implementation (*pending funding*)

For details see [the zstd-rs workplan](/initiatives/workplans/zstd-rs/).

### Support zstd-rs

Please [get in touch with us](/support), if you are interested in financially supporting us. We offer technical support services for organizations wanting to adopt our data compression software.
