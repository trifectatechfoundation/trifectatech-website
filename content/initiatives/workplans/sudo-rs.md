+++
title = "Sudo-rs"
slug = "sudo-rs"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "/initiatives/privilege-boundary"
backTitle = "Privilege boundary"
+++

### Current work

* Port sudo and su to FreeBSD
* Improve compatibility with the original sudo utility
* Support for often-used configuration options in /etc/sudoers
* Ability to configure /etc/sudoers options on a per-user, per-command, per-host basis.
* Improved environment handling (SETENV)

This work is funded by [NLnet Foundation](https://nlnet.nl/project/sudo-rs/).

### Future Roadmap

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

### Completed Milestones in the Initial Development Phase

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
