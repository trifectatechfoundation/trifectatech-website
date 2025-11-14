+++
title = "Privilege boundary"
slug = "privilege-boundary"
template = "initiatives/initiative.html"

[taxonomies]
category = ["infrastructure"]

[extra]
summary = "<p>The sudo utility mediates a critical privilege boundary on every open-source operating system that powers the Internet.</p>"

projects = [
    "sudo-rs",
    "allowd",
    "ssh-server"
]

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

Utilities like sudo mediate a critical privilege boundaries on almost every open-source operating system that powers the Internet.

The Privilege Boundary initiative provides alternative that don't suffer from memory safety vulnerabilities and are designed to minimize attack surface.

### What We've Done

Our sudo implemention, sudo-rs was [first released](https://www.memorysafety.org/blog/sudo-first-stable-release/) on Aug 29, 2023. It has since been packaged for Debian, Fedora and Ubuntu. In October 2025, `sudo-rs` [became the default sudo in Ubuntu 25.10](https://canonical.com/blog/canonical-releases-ubuntu-25-10-questing-quokka).

In late 2025, we started work on a proof-of-concept SSH server implementation in Rust.

### Roadmap

See the [sudo-rs](/projects/sudo-rs/), [allowd](/projects/allowd/) and [SSH server](/projects/ssh-server/) project pages.


