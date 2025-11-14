+++
title = "sudo-rs"
slug = "sudo-rs"
template = "projects/project.html"

[extra]
summary = "<p>The sudo utility mediates a critical privilege boundary on every open-source operating system that powers the Internet.</p>"

links = [
    { name = "GitHub", href = "https://github.com/trifectatechfoundation/sudo-rs" },
    { name = "FAQ", href = "https://github.com/trifectatechfoundation/sudo-rs/blob/main/FAQ.md" },
    { name = "Roadmap", href = "#roadmap" },
    { name = "News", href = "#news" },
]

funders = [
    "sta",
    "canonical"
]

supporters = [
    "nlnetfoundation",
    "ngi-zero-core",
    "min-bzk",
    "prossimo",
    "tweedegolf",
    "aws"
]

blogposts = [
    "Canonical releases Ubuntu 25-10 with sudo-rs as the default sudo",
    "Frequently Asked Questions about sudo-rs",
    "Memory-safe sudo to become the default in Ubuntu",
    "A new home for memory safe sudo",
    "Providing official Fedora Linux RPM packages for ntpd-rs and sudo-rs",
    "Sudo-rs dependencies: when less is better",
    "Testing sudo-rs and improving sudo along the way",
    "Re-implementing Sudo in Rust",
    "Two core Unix-like utilities, sudo and su, are getting rewrites in Rust"
]
+++

The sudo and su utilities mediate a critical privilege boundary on almost every open-source operating system that powers the Internet. Sudo-rs is a sudo alternative that doesn't suffer from memory safety vulnerabilities and is designed to minimize attack surface.

Sudo-rs is part of our [Privilege Boundary initiative](/initiatives/privilege-boundary/).

### About

Sudo-rs was [first released](https://www.memorysafety.org/blog/sudo-first-stable-release/) on Aug 29, 2023. 
It has since been packaged for Debian, Fedora and Ubuntu and is also being adopted by security-focused distributions such as NixOS and Wolfi Linux, and [AerynOS](https://aerynos.com/), an experimental next evolution in Linux distribution.

In October 2025, `sudo-rs` [became the default sudo in Ubuntu 25.10](https://canonical.com/blog/canonical-releases-ubuntu-25-10-questing-quokka).

We'd like to thank Todd Miller, maintainer of the original sudo utility, for his advice and guidance on our implementation.

### Roadmap

For past, current and future development, see the [the sudo-rs workplan](/initiatives/workplans/sudo-rs).

### History

The initial development of sudo-rs was started and funded by the [Internet Security Research Group](https://www.abetterinternet.org/) as part of the [Prossimo project](https://www.memorysafety.org/).

In July 2024 the [sudo-rs moved to the Trifecta Tech Foundation](https://www.memorysafety.org/blog/trifecta-tech-foundation-sudo-su/).

### Support sudo-rs

Please [get in touch with us](/support), if you are interested in financially supporting us.
