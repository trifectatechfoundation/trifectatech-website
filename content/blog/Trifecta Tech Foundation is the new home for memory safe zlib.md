+++
title = "Trifecta Tech Foundation is the new home for memory safe zlib"
slug = "new-home-for-memory-safe-zlib"
authors = ["Erik Jonkers"]
date = "2024-11-07"

[taxonomies]
tags = ["zlib-rs", "data compression"] 

+++

Today we're pleased to announce that the recently developed open source memory safe implementation of zlib – [zlib-rs](https://github.com/trifectatechfoundation/zlib-rs) – initiated by ISRG's [Prossimo project](https://www.memorysafety.org) now has a new long-term home at our Trifecta Tech Foundation.

<!-- more -->

*This announcement is also published on ISRG's [Prossimo website](https://www.memorysafety.org/blog/zlib-to-trifecta-tech/)*.

In 2023, Prossimo set out to develop a strategy, raise funds, and select a contractor for a memory safe zlib implementation in 2023. They did this because data compression algorithms, and zlib in particular, are used in a vast number of protocols and file formats throughout all of computing. In the past, compression libraries have encountered [memory safety vulnerabilities](https://www.memorysafety.org/docs/memory-safety/), a common phenomenon for libraries written in C/C++ and a class of issues that critical system software should not suffer from.

Prossimo contracted [Tweede golf](https://tweedegolf.nl/) in December of 2023 for an initial implementation based on zlib-ng, with a focus on maintaining excellent performance while introducing memory safety. The project was made possible through funding provided by [Chainguard](https://www.chainguard.dev/) and a time investment by Tweede golf. 

An early release of the zlib-compatible dynamic library is available on [crates.io](https://crates.io/crates/libz-rs-sys).

**New home**

Trifecta Tech Foundation is already the long-term home of two other Prossimo initiatives: memory safe [NTP](https://github.com/pendulum-project/ntpd-rs) and [sudo](https://github.com/trifectatechfoundation/sudo-rs).

"When the Tweede golf team suggested having zlib-rs become part of Trifecta Tech Foundation's [data compression initiative](https://trifectatech.org/initiatives/data-compression/), it was an easy decision to make on our end", Josh Aas, Head of Prossimo, says. "Trifecta Tech Foundation is backed by the team from Tweede golf and we know that they are good stewards of open source while also being leading experts in writing in memory safe languages".

> “The zlib compression method has grown in importance over its 30 year history such that today it handles a great deal of media compression. We're proud to work with Trifecta Tech Foundation to introduce a memory safe and high performance zlib implementation that can help serve the Internet for years to come.”  
-- Josh Aas, Head of ISRG's Prossimo project

Trifecta Tech Foundation aims to mature the zlib-rs project and support its maintainers. Zlib-rs will be part of the Foundation’s data compression initiative that includes four compression libraries: [zlib, bzip2, zstd and xz](https://trifectatech.org/initiatives/data-compression/).

**What's next?**

Work on Webassembly optimizations, kindly funded by [Devolutions](https://devolutions.net/), is underway. A security audit by Prossimo is nearing completion and is expected to be done in November 2024\. When successfully finished, the Trifecta Tech Foundation team will continue to work with Mozilla, who are interested in potentially shipping zlib-rs in Firefox.

That said, work on zlib-rs is not yet complete. Trifecta Tech Foundation is seeking funding to make the initial implementation ready for production. [Contact us](/support) if you’re interested.

---

***Support Trifecta Tech Foundation***

*Trifecta Tech Foundation is a non-profit and a Public Benefit Organisation (Dutch: ANBI), the equivalent of a 501(c)(3) in the US. We develop and maintain digital commons, open-source software and open standards for vital systems. If you'd like to support our work, please consider [sponsoring us on GitHub](https://github.com/sponsors/trifectatechfoundation), or encouraging your company to [become a sponsor](/support/).*

***Support ISRG***

*ISRG is a 501(c)(3) nonprofit organization that is 100% supported through the generosity of those who share our vision for ubiquitous, open Internet security. If you'd like to support our work, please consider [getting involved](https://www.abetterinternet.org/getinvolved/), [donating](https://www.abetterinternet.org/donate/), or encouraging your company to [become a sponsor](https://www.abetterinternet.org/sponsor/).*

