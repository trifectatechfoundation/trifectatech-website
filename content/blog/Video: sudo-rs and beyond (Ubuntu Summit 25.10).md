+++
title = "Video: sudo-rs and beyond (Ubuntu Summit 25.10)"
slug = "video-sudo-rs-and-beyond"
authors = ["Marc Schoolderman"]
date = "2026-01-09"

[taxonomies]
tags = ["sudo-rs"]
+++

After sudo-rs was included in the [25.10 release of Ubuntu](https://canonical.com/blog/canonical-releases-ubuntu-25-10-questing-quokka), Marc was invited to the Ubuntu Summit to talk about the design choices that shaped sudo-rs. You can now watch the recording of the talk.

<!-- more -->

## About sudo-rs

[sudo-rs](https://github.com/trifectatechfoundation/sudo-rs) is a safety-oriented and memory-safe implementation of sudo and su written in Rust. It was initiated by [Prossimo](https://www.memorysafety.org/initiative/sudo-su/), built by a joint team from [Ferrous Systems](https://ferrous-systems.com/) and [Tweede golf](https://tweedegolf.nl/en), and has since moved to Trifecta Tech Foundation to ensure long-term maintenance.

It is meant to be a drop-in replacement for all common use cases of sudo, i.e. supporting all commonly used command line options from [the original sudo implementation](https://www.sudo.ws/).

This also means that some parts of the original sudo are explicitly not in scope.  To learn about the considerations that were made, watch the recording of Marc's talk:

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ef3xKvm0Qqw?si=keBLInCjRv3jeJhH" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## About Marc

[Marc Schoolderman](https://tweedegolf.nl/en/about/29/marc) is a Software Developer at Tweede golf, and the lead engineer of sudo-rs. He enjoys low-level programming, and working with a team of skilled engineers in an open source environment. Previously, he spent time in academia, researching ways to make formal verification practical. In his spare time, Marc likes solving non-existing problems using bash+awk+sed, learning about history, and dabbling in analogue photography.

---

### About Trifecta Tech Foundation

[**Trifecta Tech Foundation**](https://trifectatech.org) is a non-profit and a Public Benefit Organisation (501(c)(3) equivalant) that creates open-source building blocks for critical infrastructure software. Our initiatives Data compression, Time synchronization, Smart grid protocols and Privilege boundary, impact the digital security of millions of people. If you'd like to support our work, please contact us; see [trifectatech.org/support](https://trifectatech.org/support/).