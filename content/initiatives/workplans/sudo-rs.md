+++
title = "Sudo-rs"
slug = "sudo-rs"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "initiatives/privilege-boundary"
backTitle = "Back to initiative: Privilege boundary"
+++

## Roadmap

[Current development](#current-work) (Oct 2024 - Apr 2025) includes increasing cross-platform support and improve compatibility with the original sudo utility.

[Future work](#future-work) (*pending funding*) includes Improved Compatibility, Usability Enhancements, and Enterprise features.

In 2023 and 2024 we [completed milestones 0-3](#completed-milestones) and released the first versions of sudo-rs.

### Current work

**Milestone 4: Maintenance and portability**

* Port sudo and su to FreeBSD
* Improve compatibility with the original sudo utility
* Support for often-used configuration options in /etc/sudoers
* Ability to configure /etc/sudoers options on a per-user, per-command, per-host basis.
* Improved environment handling (SETENV)

This work is funded by [NLnet Foundation](https://nlnet.nl/project/sudo-rs/) and the [Ministry of the Interior of the Netherlands](https://www.government.nl/ministries/ministry-of-the-interior-and-kingdom-relations).

--- 

### Future work

**Improved Compatibility**

* Port sudo and su to other platforms (MacOS, NetBSD, ...)

**Usability Enhancements**

* Enhanced password prompt that display more of the security context
* Support reading the doas configuration file
* A migration guide and FAQ for users

**Enterprise features**

* Preventing shell escapes (NOEXEC, NOINTERCEPT)
* sudoedit implementation
* Improved audit trails (i.e. session recording)
* SELinux support
* AppArmor support

--- 

### Completed milestones

**Milestone 0: Preparation**

* System architecture and requirements
* Project setup
* Sudoers file parsing

**Milestone 1: Drop-in replacement with a default config**

* Core sudo pipeline from policy verification to minimal command execution without
security features
* Sudoers based policy, with limited feature support
* Authentication based on PAM
* Command execution using exec with basic signal and fd passing
* Test for Ubuntu 22.04 with a default sudoers config
* Setup testing framework

**Milestone 2: Security parity**

* Core sudo pipeline with full sanitation of signals, file descriptors, limits, ptrace, pty management, etc. and
more efficient command execution
* Add su implementation
* Testing for full security compliance
* Wider configuration feature flag support
* User facing documentation
* Credential caching

**Milestone 3: Deployability**

* Improve usability by implementing commonly used feature flags and configuration options (such as sudo -l, and various reasonable configuration options)
* Implement visudo
* More complete user facing documentation
* First public release of sudo and su aimed at single-user systems
* Support for other Linux distributions than Debian/Ubuntu (i.e. Fedora-based ones)
