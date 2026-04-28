+++
title = "Three years of Rusty sudo"
slug = "three-years-of-rusty-sudo"
authors = ["Marc Schoolderman"]
date = "2026-04-24"

[taxonomies]
tags = ["sudo-rs"] 

+++

**Almost three years ago, [sudo-rs was announced to the world](https://tweedegolf.nl/en/blog/91/reimplementing-sudo-in-rust). Just last week, it became the default `sudo` implementation in the Ubuntu LTS release [*Resolute Raccoon*](https://ubuntu.com/blog/unmasking-the-resolute-raccoon). Now is a good time to reflect.**

<!-- more -->

*Heads-up!* This will not be a blog where we sing the praises of "oxidisation". Even if you are skeptical about Rust rewrites, we hope you'll get something out of this blog.

Instead, we'll discuss the original reasons we cited for starting the work on sudo-rs, and how we think these have survived contact with the real world.

We're also rather pleased with how some things have unfolded: the way we handled security bugs and avoided others, and the way external contributors have started to support the project. We'll talk about those!

Finally, we will talk about the one thing that we would like to see going forward: the ability for users of Linux distributions to easily switch between sudo and sudo-rs.

## The story so far

In the first [blog post](https://tweedegolf.nl/en/blog/91/reimplementing-sudo-in-rust) about the sudo-rs project, we mentioned two *raisons d'être* for sudo-rs:

- 1. Memory safety: the original author estimated that 30% of serious bugs in sudo are caused by memory issues.  
- 2. Avoid business logic bugs by writing in a higher-level language

Before diving into the current status, let's be clear about one thing. Original sudo is a mature and well-written piece of software, maintained by a battle-tested maintainer with decades of experience writing UNIX software. In other words, the bar for any re-implementation was quite high.

So where do we stand?

- **Did we have to fix any memory safety bugs in sudo-rs over the past three years?** Nope! Did original sudo have them? Yes: last month ZeroPath published [several fixes](https://zeropath.com/blog/sudo-bug-fixes) for original sudo. Out of the four official security advisories for original sudo since 2023, [one](https://www.sudo.ws/security/advisories/double_free/) was explicitly related to memory safety. 

There is some important fine print however, which we'll mention below.  
     
- **Did we avoid logic bugs?** Hard to know for certain, but one clue might be that we found a few business logic bugs in original sudo through our testing framework. Most of these were quite subtle edge cases. Also, as critics are wont to point out, any rewrite-from-scratch project is also going to introduce bugs. And we have done that; the most annoying example of course being [CVE-2025-64517](https://github.com/advisories/GHSA-q428-6v73-fc4q). But we haven't made *that* many mistakes.  
     
On a related note, the biggest benefit of using a higher-level language was something we hadn't anticipated: that it makes our business logic more accessible to external contributors!

In the original blog, we also wrote:

> Just using Rust by itself is not a silver bullet.

Around the time the blog was posted, we already realised that doing a "full rewrite" would be unrealistic--and also rather pointless. If one were to take original sudo and magically compile it into "memory safe C", you would still end up with plenty of CVEs. We were and are much more concerned with *attack surfaces*. Memory safety is an important facet in that, but certainly not the only one.

And that is the fine print: the three most recent [sudo.ws advisories](https://www.sudo.ws/security/advisories/) did not affect sudo-rs since we simply *did not implement* the functionality they targeted. And of the memory safety bugs by ZeroPath, many of them concerned functionality for the "external log server", which we never even had on our roadmap.

One of the interesting aspects of writing a privilege escalation tool is that it doesn't just need to be secure by itself, but often needs to have protections to avoid exploiting quirks and bugs in other software components as well. For example, since [CVE-2023-2002](https://marc.info/?l=oss-security&m=168164424404224&w=2), original sudo has stopped trying to nicely format the output of `sudo --help` to fit your terminal window, since asking for the window size could trigger a bug in the Bluetooth subsystem of the Linux kernel!

## Sudo-rs and CrackArmor

An interesting example of sudo needing protections for vulnerabilities in *other system components* is the recent [CrackArmor](https://cdn2.qualys.com/advisory/2026/03/10/crack-armor.txt) disclosure by Qualys. What piqued our interest was the `AppArmor + Sudo + Postfix = root` section.

The gist of this attack is:

**1.** `su --pty` can be used by an unprivileged user to re-configure AppArmor  
**2.** AppArmor can be configured to sabotage sudo  
**3.** A `sudo` command will then fail, and try to send an email to the sysadmin to inform them about it  
**4.** But because it is sabotaged, sudo will run the mail program as root, under control of the malicious user

Security-minded people typically like to identify "the weakest link in the chain"; what we find interesting in the above scenario is that it is the entire chain that is weak!

To be absolutely clear, this is not a vulnerability in either su or sudo *per se*, but rather a combination of technical peculiarities that allows them to be used as a crowbar to widen a pre-existing crack. The truly vulnerable part here was AppArmor, and to a lesser degree, `su` was lacking adequate hardening.

So how do our versions of sudo and, also, our [re-implementation of su](https://github.com/trifectatechfoundation/sudo-rs?tab=readme-ov-file#aim-of-the-project) fair in this attack scenario?

**1.** `su-rs` uses the `use_pty` code from sudo-rs, which in turn is heavily based on Todd Miller's `use_pty` code, which has been extensively used over the years. Qualys tried, but was not able to trick it into writing AppArmor config files.  
     
**2.** Let's however suppose that AppArmor still would be sabotaged in some other way.  
     
**3.** `sudo-rs` would still be malfunctioning, but does not attempt to send mail because we deliberately removed this feature.  
     
**4.** We determined that, due to the way sudo-rs changes user-privileges, even a sabotaged `sudo-rs` would not launch a program with root privileges under control of the user (such as an editor, or an askpass helper).

We take credit for points one and three, because the design of sudo-rs and su-rs is a result of conscious decisions.

For the fourth point, we feel we got a bit lucky. To *temporarily* change privileges, sudo-rs internally has a function that takes a [closure](https://en.wikipedia.org/wiki/Closure_(computer_programming))--a trick not available in C. That will have made consistent error checking easier, but of course we hadn't anticipated the CrackArmor scenario. Like Todd Miller we have added a few more sanity checks in our code base since reading the Qualys report.

## Advisories

We are proud of our security advisories. Not that they were needed--obviously--but in the way that we handled each of them.

Let's reveal some fun facts, in order of occurrence:

**1.** A [relative path traversal](https://github.com/trifectatechfoundation/sudo-rs/security/advisories/GHSA-2r3c-m6v7-9354) was found by a security audit we explicitly requested. It also existed in original sudo, and the fix was a re-design of the timestamp file in coordination with Todd Miller, released in sudo 1.9.15 and sudo-rs 0.2.1.  
     
**2.** A [local info leakage](https://github.com/trifectatechfoundation/sudo-rs/security/advisories/GHSA-w9q3-g4p5-5q2r) was discovered by [Sonia Zorba](https://www.zonia3000.net). This seems to have been a direct consequence of Ubuntu's blog post about [oxidizr](https://github.com/jnsgruk/oxidizr).  
     
**3.** While fixing that, we found another [local info leakage](https://github.com/trifectatechfoundation/sudo-rs/security/advisories/GHSA-98cv-wqjx-wx8f) which also existed to a lesser degree in original sudo, and was again fixed in coordination with Todd.  
     
**4.** A [partial authentication bypass](https://github.com/trifectatechfoundation/sudo-rs/security/advisories/GHSA-q428-6v73-fc4q) was discovered by [Adrian Noyes](https://github.com/Pingasmaster). This did not impact default installations, and was only exploitable by users that an admin had given sudo rights, but still... This advisory, more than any other, clearly can be identified as "Rust is no silver bullet". Apart from this advisory, the reporter also suggested security hardening measures for `sudoedit`, and fixed an integer underflow problem.  
     
**5.** Another [local info leakage](https://github.com/trifectatechfoundation/sudo-rs/security/advisories/GHSA-c978-wq47-pvvw) dealing with password timeouts was reported by [Thomas Geiger](https://github.com/DevLaTron). While the timeout bug only occurred in sudo-rs, both the sudo-rs team and Todd Miller decided to harden the password input prompt by even making it resistant to `SIGKILL` (see this [recent commit](https://github.com/sudo-project/sudo/commit/9080a379296d384c035ff62eed970e3d49d49674)). Furthermore, the observation that our `pwfeedback` routine was not vulnerable made it much easier to decide, technically, that it might as well become the default.

None of these were classified by us as being "High" severity.

We understand feelings of *schadenfreude* when a new security-oriented program publishes advisories, but users should actually be more concerned if we hadn't published any advisories. Towards the future, we are not promising "no vulnerabilities"--we are promising a responsible attitude towards them: taking preventative measures, fixing them in coordination, and publishing without hesitation.

## Community involvement

In 2023, the project was initiated by [ISRG's Prossimo project](https://www.memorysafety.org/initiative/sudo-su/) with the actual development spearheaded by six engineers from [Tweede golf](https://www.tweedegolf.nl) and [Ferrous Systems](https://ferrous-systems.com/).

Since then, many more people have lent a helping hand.

The continued endurance of the project would not have been possible without the crucial support from the [NLNet Foundation](https://nlnet.nl/project/sudo-rs/), who also supported [porting sudo-rs to FreeBSD](https://nlnet.nl/project/sudo-rs-FreeBSD-compat/). Thanks to them we had time for boring maintenance tasks and adding several compatibility features needed for adoption.

This made it possible for [Canonical to come knocking on our door](https://discourse.ubuntu.com/t/adopting-sudo-rs-by-default-in-ubuntu-25-10/60583). No matter if Ubuntu is your favourite Linux distribution, we have to say: it was an absolute joy to work together with their professional team, and this collaboration has benefited sudo-rs enormously. Thanks to them we could finish the final missing bit that makes sudo sudo: `sudoedit`. We especially appreciated their [Main Inclusion Review](https://documentation.ubuntu.com/project/MIR/main-inclusion-review/), which improved our implementation of sudo's `NOEXEC` feature.

Sudo-rs has also enjoyed support from the [Sovereign Tech Agency](https://www.sovereign.tech/) to add localisation support.

Our inclusion in [*Questing Quokka*](https://discourse.ubuntu.com/t/carefully-but-purposefully-oxidising-ubuntu/56995) also drove more users towards us with bug reports, questions, and complaints. All of these have helped us tremendously.

To give you an idea of how important user feedback is for us: one of the more noticed recent changes was enabling visual feedback while typing your password by default. This feature was initially not even on our roadmap! It was requested in early 2025 by a user, implemented by us after some consideration, and then changed into the default by a pull request submitted by a different user. Similarly, `sudo --bell` and password timeouts were added by external contributors. Many other changes (such as improved test cases, better error messages, fixing arcane bugs related to UNIX terminal handling) were contributed by others.

Last but certainly not least, our contact with [Todd C. Miller](https://millert.dev) has been extremely important for us. He agreed to join one of our first team meetings in January 2023, which became a Q&A in "what to do differently if you create sudo from scratch". We are also directly contributing back to his project by discovering weird corner cases and regressions through our testing framework. No matter what people's opinions are about sudo-rs, we are extremely pleased to see that the very existence of our project seems also to have led to an [increased appreciation](https://www.theregister.com/2026/02/03/sudo_maintainer_asks_for_help/?td=rt-3a) of the important work that Todd has been doing to keep millions of computers humming along.

## Our wish for users of Linux distributions

Right now, we have official packages for many distributions (such as Debian, Fedora and Arch Linux). Several use the `sudo-rs` and `su-rs` command names, which we [do not think is great](https://github.com/trifectatechfoundation/sudo-rs/blob/main/FAQ.md#i-dont-like-the-command-name-sudo-rs). While it does allow users to evaluate sudo-rs, it is not the same as a full replacement. Another downside is that these packages are sometimes only [usable if original sudo is kept installed](https://github.com/trifectatechfoundation/sudo-rs/pull/1301) because they share the configuration files. But this obviously negates the security benefits; Having more privilege escalation tools installed on a system makes one less, not more secure.

We recognize that there will be users that continue to require "original" sudo; for example because they use a feature we deliberately dropped to reduce attack surfaces, such as storing configuration in LDAP support, logging to remote servers, sending email to the sysadmin, storing fully replays of sudo sessions, ... and so forth.

Therefore, we advocate for allowing users a realistic mechanism to choose.

One example is the approach taken by Ubuntu 26.04. It ships with *only* sudo-rs by default. But it is possible to install `sudo.ws` and use the `update-alternatives` command to get the "original" sudo. It is then possible to fully uninstall sudo-rs. And later on, this change can be easily reversed again. To us, this is the big change of *Resolute Raccoon*. Another is NixOS, where switching to sudo-rs is done by setting `security.sudo-rs.enable = true` in a configuration file.

On Debian, Fedora and Arch Linux due to sudo being the only game in town, it has a more or less entrenched status: uninstalling it would typically be an error and the packaging tools might prevent you from doing it. This entrenchment makes it harder for users to switch. Changing this is not easy: our current distribution packagers cannot do it by themselves, it will require a deeper effort from those Linux distributions.

This will take time. Distributions are being packaged by volunteers whose time is limited, and more conservative Linux distributions may want to wait and see a bit longer before spending the effort to integrate sudo-rs more fully. But Ubuntu and NixOS show that it can be done.

## The next chapter?

So do we think we were right in starting sudo-rs? Yes. The most significant change in our thinking compared to three years ago is that we've put reducing attack surfaces front and center, as exemplified by the adoption of our [criteria for inclusion of features](https://github.com/trifectatechfoundation/sudo-rs/blob/main/CONTRIBUTING.md). We've embraced that this means sudo-rs will not be as feature-rich as original sudo.

We have dealt with bugs. This is actually good: if we hadn't had any to report in these past three years, that would be more worrisome--since it would mean nobody looked. In fact: many people did, and helped us create a more secure and more usable sudo-rs. And as it should with any piece of software, this remains an on-going effort.

Today, sudo-rs is well-supported on Ubuntu, and some specialty Linux distros such as [PostmarketOS](https://postmarketos.org/edge/2026/03/18/sudo-rs-instead-of-doas/). We hope we'll see this happen in other mainstream distributions and stand ready to assist!  

---

### About Trifecta Tech Foundation

**Trifecta Tech Foundation** is a non-profit and a Public Benefit Organisation (501(c)(3) equivalent) that creates open-source building blocks for critical infrastructure software. Our initiatives on data compression, time synchronization, and privilege boundary, impact the digital security of millions of people. If you’d like to support our work, please contact us; see [trifectatech.org/support](https://trifectatech.org/support/).