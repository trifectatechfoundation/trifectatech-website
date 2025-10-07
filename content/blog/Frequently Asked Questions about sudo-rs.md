+++
title = "Frequently Asked Questions about sudo-rs"
slug = "frequently-asked-question-about-sudo-rs"
authors = ["Marc Schoolderman"]
date = "2025-10-08"

[taxonomies]
tags = ["sudo-rs"]
+++

With [sudo-rs coming to Ubuntu 25.10](https://trifectatech.org/blog/memory-safe-sudo-to-become-the-default-in-ubuntu/), the core team has collected and published the Frequently Asked Questions about sudo-rs. They will be updated if user curiosity calls for it.

<!-- more -->

You can find the FAQ in [the sudo-rs GitHub repository](https://github.com/trifectatechfoundation/sudo-rs/blob/main/FAQ.md). The document covers a wide range of questions, from technical decisions made by the sudo-rs team, to vulnerabilities in both sudo-rs and original sudo. Some examples:

- [What is the advantage of rewriting sudo in Rust?](#What-is-the-advantage-of-rewriting-sudo-in-Rust)
- [Why did you get rid of the GNU license?](#Why-did-you-get-rid-of-the-GNU-license)
- [If I do grep unsafe why do I find hundreds of occurrences?](##If-I-do-grep-unsafe-why-do-I-find-hundreds-of-occurrences)
- [What about doas?](##What-about-doas)
- [Are there actual memory safety vulnerabilities in the original sudo?](##Are-there-actual-memory-safety-vulnerabilities-in-the-original-sudo)

... etc. 

## What is the advantage of rewriting sudo in Rust?

The reasons that were mentioned in the [blog post](https://tweedegolf.nl/en/blog/91/reimplementing-sudo-in-rust) announcing sudo-rs still hold true:

1. Obviously, better memory safety. In C a programmer needs to pay attention at every turn to check that memory is being used correctly. The Rust programming language helps the programmer avoid mistakes by tracking data allocation "at compile time". On top of that, it performs runtime checks to prevent the worst possible outcome in case mistakes do happen.

2. Rust can be used as a systems language, like C, but it also facilitates programming at a much higher level of abstraction. For example, parts of the business logic of sudo-rs are implemented using `enum` types, and evaluated by chaining Rust "iterators" together. And of course our entire code base leans into the ease-of-use offered by `Option` and `Result` types. To achieve the same thing in C, a programmer would need to explicitly implement the logic underpinning those concept themselves. (Which is what you will find that original sudo has done---and that added complexity is where bugs can thrive).

3. A rewrite is also a good time for a rethink. As in every realistic piece of software, there are many many code paths in original sudo [that are seldom exercised](https://www.stratascale.com/vulnerability-alert-CVE-2025-32463-sudo-chroot) in normal usage. Bugs can lurk there as well, undiscovered for years until someone takes a look. But, if some code paths are seldomly executed, why include them at all? This of course is the lesson that OpenBSD's `doas` teaches us.

## Why did you get rid of the GNU license?

We didn't.

sudo is not a GNU tool but a cross-platform software project maintained by Todd Miller. It existed long before the GNU project did. It is licensed under the OpenBSD license, which is functionally equivalent to the MIT license that one can choose for sudo-rs.

The reason Trifecta Tech Foundation keeps sudo-rs under the MIT+Apache 2.0 dual license is simply this: it is the most common in the Rust ecosystem, and it is exactly as permissive as original sudo towards end-users. In fact, requiring that external contributors also agree with distribution under Apache 2.0 actually makes sudo-rs a tiny bit more tightly licensed.

We understand the objections that some people may have when a piece of software that falls under the GPL gets re-implemented under a more permissive license. It also wouldn't make good engineering sense for sudo-rs to use a more permissive license than Todd Miller uses, because it would mean we wouldn't be able to consult his source code. 

Trifecta Tech projects that are "re-implementations" typically respect the original license: zlib-rs uses the Zlib license, bzip2-rs uses the bzip2 license, etc.

## If I do grep unsafe why do I find hundreds of occurrences?

Because they are necessary.

The `unsafe` keyword is part of Rust's memory safety design. The most important thing it allows is dereferencing "raw pointers", and calling other functions marked as "unsafe", such as those found in the C library. Because sudo-rs is a system utility, it needs to interface with the operating system and system libraries, which are written in C. Most of the `unsafe` code in sudo-rs lives at those seams. A prime example of this is the `setuid()` function itself---without which it would be really hard to write sudo.

Also note that about half of our `unsafe` blocks happens in unit test code---to test our "unsafe parts". For the other half, every usage of `unsafe` is accompanied by a `SAFETY` specification, every one of which has been vetted by at least two sudo-rs team members.

Finally, wherever it was possible, we use [Miri](https://github.com/rust-lang/miri) to test our `unsafe` blocks to be sure we didn't create any so-called "undefined behaviour".

We have seen some attempts at 'myth busting' Rust code by counting the number of times `unsafe` occurs. But that is mistaking the forest for the trees. Of course we understand the criticism: sudo-rs is a new program and needs to prove itself. But we are not spreading myths about sudo-rs having "memory safety-by-design" at its core.

At the very least, a few hundred lines of well-documented `unsafe` code is still less than hundreds of thousands of them.

## What about doas?

On OpenBSD, doas is great and sudo-rs has taken inspiration from it. But it was written specifically for OpenBSD.

On Linux, it is available as the OpenDoas port, which requires quite a bit of glue code (some of which is actually taken directly from Todd Miller's sudo!), and still uses over 5000 lines of C. It also doesn't come with an automated test suite. In the words of the maintainer of OpenDoas:

There are fewer eyes on random doas ports, just because sudo had a vulnerability
does not mean random doas ports are more secure if they are not reviewed.

OpenDoas also has one unresolved CVE related to TTY hijacking for 2 years (https://nvd.nist.gov/vuln/search/results?query=opendoas) for which a remedy isn't easy (https://github.com/Duncaen/OpenDoas/issues/106). This is an attack scenario that sudo-rs, like sudo, util-linux's su and systemd's run0 have remedies for (and have had to spent substantial effort in "getting things right"). It's also clear that at the time of writing OpenDoas is not that actively maintained (https://github.com/Duncaen/OpenDoas/pull/124).

That being said, we admire the minimalist approach exemplified by doas, and this is expressed by what we internally call our "Berlin Criteria" in our contributing guidelines.

If we zoom in on a line-for-line comparison, how does sudo-rs compare to OpenDoas' ~5000 lines of C code? sudo-rs is around 40.000 lines of Rust code. Of those, 25.000 lines are test code, which leaves around 15.000 lines of production code. Of those, less than 350 are "unsafe". If we compare both to original sudo, we find that it contains over 180.000 lines of C. So on this spectrum, it is much closer to doas than to original sudo.

On a more practical side, as with run0, switching to doas would require users to rewrite their sudoers configurations to doas configurations. That might be possible in many cases, but not all.

This is not say that you should not use OpenDoas. TTY hijacking attack might not be relevant for you (for example, because you disabled the feature that allows it in the Linux kernel), and you may need the tiny footprint or prefer the simpler configuration file. But OpenDoas (at least in its current form) isn't a solution for everybody.

## Are there actual memory safety vulnerabilities in the original sudo?

Serious vulnerabilities in sudo are listed by the developer of C-based sudo, Todd Miller, on https://www.sudo.ws/security/advisories/. The first page lists several memory safety vulnerabilities (anything that says “buffer overflow”, “heap overflow" or “double free”). One of the oldest ones we know of is from 2001, published in Phrack https://phrack.org/issues/57/8 under the whimsical name “Vudo”, which quite dramatically showed an attacker gaining full access on a system that it only had limited access to.

A good recent example is the “Baron Samedit” bug that was discovered by security firm Qualys in 2021, which like “Vudo" would cause an uncontrolled privilege escalation. There are many websites and YouTube videos that illustrate it. It is formally identified as CVE-2021-3156 and is described at https://www.sudo.ws/security/advisories/unescape_overflow/

Now, the fine point here of course is: "Baron Samedit” was discovered by security researchers who were working together with the developer of C-based sudo. If you want to know if any of these sudo vulnerabilities have been used to cause harm to systems, we need only look at CISA, that does include it (https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-117a) in its list of “commonly exploited” vulnerabilities of 2021.

Also, consider this: the bug behind “Baron Samedit” was present in sudo between 2011 and 2021. That’s a long time. So it’s quite possible that someone already knew it existed before 2021, but simply didn’t tell anybody else.

Beyond sudo, a [memory safety vulnerability](https://nvd.nist.gov/vuln/detail/cve-2021-4034) was also discovered in `pkexec`, another sudo-like progam.

Note that in real-world attacks, sudo vulnerabilities would usually be combined with exploits in other software. For example, it may be possible to gain limited access on a machine by using an exploit in a webserver. If that machine then has a seriously vulnerable outdated sudo on it that allows an attacker to turn that limited access into full access, what may look like a minor bug in a webserver can turn into a nightmare. I.e. memory safety bugs in sudo have the potential to dramatically amplify the impact of bugs in other pieces of software.

## Read more FAQs

If your curiosity hasn't been sated yet, read more [here](https://github.com/trifectatechfoundation/sudo-rs/blob/main/FAQ.md).