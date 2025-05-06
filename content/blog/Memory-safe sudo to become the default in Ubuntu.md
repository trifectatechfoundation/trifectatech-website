+++
title = "Memory-safe sudo to become the default in Ubuntu"
slug = "memory-safe-sudo-to-become-the-default-in-ubuntu"
authors = ["Erik Jonkers"]
date = "2025-05-06"

[taxonomies]
tags = ["sudo-rs", "announcement"] 

+++

**May 6, 2025** – Ubuntu 25.10 is set to adopt **sudo-rs** by default. Sudo-rs is a memory-safe reimplementation of the widely-used `sudo` utility, written in the Rust programming language. 

<!-- more -->

This move is part of a broader effort by **Canonical** to improve the resilience and maintainability of core system components. Sudo-rs is developed by the **Trifecta Tech Foundation (TTF)**, a nonprofit organization that creates secure, open source building blocks for infrastructure software.

### A Memory-Safe Future for Ubuntu

The decision to adopt sudo-rs is in line with Canonical’s commitment to [Carefully But Purposefully](https://discourse.ubuntu.com/t/carefully-but-purposefully-oxidising-ubuntu/56995) increase the resilience of critical system software, by adopting Rust. Rust is a programming language with strong memory safety guarantees that eliminates many of the vulnerabilities that have historically plagued traditional C-based software.

> "I'm delighted to be investing in critical, low-level software utilities. Ubuntu is the most widely deployed Linux operating system, and by choosing to adopt sudo-rs I hope to accelerate the path to wider adoption across the Linux ecosystem".  
-- Jon Seager, VP Engineering Ubuntu at Canonical

Sudo-rs is part of the Trifecta Tech Foundation's [Privilege Boundary initiative](https://trifectatech.org/initiatives/privilege-boundary/), which aims to handle privilege escalation with memory-safe alternatives.

> "While no piece of software - in any language - is flawless, we believe the transition to Rust in systems programming is a vital step forward. It is very exciting to see Ubuntu committing to sudo-rs and taking a leading role in moving the needle."  
-- Erik Jonkers, Chair of the Trifecta Tech Foundation.


### Preparing for Mainstream Adoption by Linux Distributions

To prepare for mainstream adoption, the maintainers of sudo-rs will complete work outlined in the project’s [Milestone 5 workplan](https://trifectatech.org/initiatives/workplans/sudo-rs/#current-work), including:

- Coarse-grained shell escape prevention (NOEXEC) on Linux
- The ability to control AppArmor profiles
- `sudoedit`
- Support for Linux Kernels older than version 5.9, used by Ubuntu 20.04 LTS

Canonical is sponsoring this milestone to make sudo-rs an even better implementation of the `sudo` command. With the above features, more users and system administrators should be able to use sudo-rs without any change to their current workflows.

The maintainers of sudo-rs are sticking to the "less is more" approach: some features of the original sudo will not be implemented in sudo-rs if they serve only highly niche use cases. The maintainers continue their collaboration with Todd Miller, the incumbent `sudo` maintainer for over thirty years, thus indirectly improving original sudo as a by-product of this engagement.

### Targeting Ubuntu 25.10

Canonical plans to make sudo-rs the default in Ubuntu 25.10. This will allow time for acceptance testing by end-users and ensure that sudo-rs is battle-tested before its inclusion in the next Long Term Support (LTS) release: Ubuntu 26.04 LTS, which will be supported for a minimum of 12 years. We are looking forward to learning from the community how we can further improve sudo-rs.

---

### About Trifecta Tech Foundation

[**Trifecta Tech Foundation**](https://trifectatech.org) is a non-profit and a Public Benefit Organisation (501(c)(3) equivalant) that creates open-source building blocks for critical infrastructure software. Our initiatives Data compression, Time synchronization, Smart grid protocols and Privilege boundary, impact the digital security of millions of people. If you'd like to support our work, please contact us; see https://trifectatech.org/support/.

### About Canonical

**Canonical**, the publisher of **Ubuntu**, provides open source software, security, support and services. Canonical's portfolio covers critical systems, from the smallest devices to the largest clouds, from the kernel to containers, from databases to AI. With customers that include top tech brands, emerging startups, governments and home users, Canonical delivers trusted open source for everyone.
Learn more at https://canonical.com/

### Further Information

- [sudo-rs Project Page on Trifecta Tech Foundation](https://trifectatech.org/initiatives/privilege-boundary/)
- [sudo-rs GitHub Repository](https://github.com/trifectatechfoundation/sudo-rs)
- [Carefully but Purposefully Oxidising Ubuntu](https://discourse.ubuntu.com/t/carefully-but-purposefully-oxidising-ubuntu/56995)

*For media inquiries, please contact Erik Jonkers, contact@trifectatech.org*
