+++
title = "Privilege boundary"
slug = "privilege-boundary"
template = "initiatives/initiative.html"

[taxonomies]
category = ["infrastructure"]

[extra]
summary = "<p>The sudo and su utilities mediate a critical privilege boundary on almost every open-source operating system that powers the Internet.</p>"

funders = [
    "prossimo",
    "nlnetfoundation",
    "ngi-zero-core",
    "ngi-zero-entrust",
    "tweedegolf"
]

blogposts = [
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
It has since been packaged for Debian, Fedora and Ubuntu and is also being adopted by security-focused distributions such as NixOS and Wolfi Linux.

Current development includes increasing cross-platform support and improve compatibility with the original sudo utility.

We'd like to thank Todd Miller, maintainer of the original sudo utility, for his advice and guidance on our implementation.

### Roadmap

See <a href="/initiatives/workplans/sudo-rs">the sudo-rs roadmap</a>.

### Links

- [GitHub](https://github.com/memorysafety/sudo-rs)

### History

The initial development of sudo-rs was started and funded by the [Internet Security Research Group](https://www.abetterinternet.org/) as part of the [Prossimo project](https://www.memorysafety.org/). A joint development effort between [Tweede golf](https://tweedegolf.nl/en) and [Ferrous Systems](https://ferrous-systems.com/) resulted in the first release. In July 2024 the [sudo-rs moved to the Trifecta Tech Foundation](https://www.memorysafety.org/).

        