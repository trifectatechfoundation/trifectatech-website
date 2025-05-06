+++
title = "Privilege boundary"
slug = "privilege-boundary"
template = "initiatives/initiative.html"

[taxonomies]
category = ["infrastructure"]

[extra]
summary = "<p>The sudo utility mediates a critical privilege boundary on every open-source operating system that powers the Internet.</p>"

funders = [
    "nlnetfoundation",
    "ngi-zero-core",
    "min-bzk",
    "canonical"
]

supporters = [
    "prossimo",
    "tweedegolf",
    "aws"
]

blogposts = [
    "Memory-safe sudo to become the default in Ubuntu",
    "A new home for memory safe sudo",
    "Providing official Fedora Linux RPM packages for ntpd-rs and sudo-rs",
    "Sudo-rs dependencies: when less is better",
    "Testing sudo-rs and improving sudo along the way",
    "Re-implementing Sudo in Rust",
    "Two core Unix-like utilities, sudo and su, are getting rewrites in Rust"
]
+++

### Sudo-rs

The sudo and su utilities mediate a critical privilege boundary on almost every open-source operating system
that powers the Internet.

Sudo-rs is a sudo alternative that doesn't suffer from memory safety vulnerabilities and is
designed to minimize attack surface.

### Project status

Sudo-rs was [first released](https://www.memorysafety.org/blog/sudo-first-stable-release/) on Aug 29, 2023. 
It has since been packaged for Debian, Fedora and Ubuntu and is also being adopted by security-focused distributions such as NixOS and Wolfi Linux, and [AerynOS](https://aerynos.com/), an experimental next evolution in Linux distribution.

Work that aims for `sudo-rs` to become [the default in Ubuntu 25.10](/blog/memory-safe-sudo-to-become-the-default-in-ubuntu) started in April 2025 and is ongoing. See the milestone "Features for Mainstream Adoption by Linux Distributions" under [current development](/initiatives/workplans/sudo-rs#current-work).

We'd like to thank Todd Miller, maintainer of the original sudo utility, for his advice and guidance on our implementation.

### Roadmap

For past, current and future development, see the [the sudo-rs roadmap](/initiatives/workplans/sudo-rs).

### Links

- [GitHub](https://github.com/memorysafety/sudo-rs)
- [crates.io](https://crates.io/crates/sudo-rs)

### History

The initial development of sudo-rs was started and funded by the [Internet Security Research Group](https://www.abetterinternet.org/) as part of the [Prossimo project](https://www.memorysafety.org/). A joint development effort between [Tweede golf](https://tweedegolf.nl/en) and [Ferrous Systems](https://ferrous-systems.com/) resulted in the first release. 

In July 2024 the [sudo-rs moved to the Trifecta Tech Foundation](https://www.memorysafety.org/blog/trifecta-tech-foundation-sudo-su/).
