+++
title = "A new name for ntpd-rs: Statime"
slug = "new-name-for-ntpd-rs-statime"
authors = ["Erik Jonkers"]
date = "2026-11-17"

[taxonomies]
tags = ["ntpd-rs", "time synchronization"] 

[extra]
image = "/blog/new-name-for-ntpd-rs-statime-1200.png"

+++

**In the coming weeks leading up to the 2.0 release, we will rename our time synchronization utility ntpd-rs to Statime. The name change affects the names of the binaries, systemd units, crates, and repositories.**

<!-- more -->

Work on ntpd-rs started in 2022, initiated by the tremendous folks of ISRG’s [Prossimo project](https://memorysafety.org/initiative/ntp/). In June of 2024, the project reached its first major milestone when [Let's Encrypt deployed it in their infrastructure](https://letsencrypt.org/2024/06/24/ntpd-rs-deployment). At that time, and up until recently, ntpd-rs delivered what the name promised: an implementation of NTP, the Network Time Protocol. 

### Why the rename?

NTP is not the only time synchronization protocol. PTP (Precision Time Protocol) is also widely used, and we previously implemented it in a separate library. It has been a long-standing ambition of our team to unite these protocols in a single time sync utility. In 2026, we've put the ambition into action: upcoming v2 versions will provide NTP with NTS (Network Time Security), PTP, and the evolving IEEE standard, Client Server PTP.

This means the "ntpd" part no longer reflects what the utility offers, which can confuse users. The "-rs" part signaled that the software is written in Rust. Statime will remain memory-safe and written in Rust, but we no longer feel the need to express this in the name.

### Why this name?

Statime is based on the Latin 'statim', originally meaning 'steadily' and later 'immediately', the sense that gave English the word 'stat'. These two properties match our goals for the upcoming version perfectly.

![A new name for ntpd-rs: Statime](/blog/new-name-for-ntpd-rs-statime.png)

<p style="margin-top: 0;">
    <span style="display: inline-block; width: 100%;font-size: smaller;text-align: center;font-style: italic;">
        Image: A new name for ntpd-rs: Statime
    </span>
</p>

In an upcoming blog post, we will talk in depth about these properties and other new features, and explain why we think an integrated approach is a step forward. [Ruben’s recent Ubuntu 26.10 Summit talk](https://www.youtube.com/live/u9j-Ih_5Cw8?t=17289s) also explains our plans and the rename in some detail.

> But wait... didn't you already have software called Statime? True! Our PTP library was previously called that. The PTP library will remain available under a different name and will be integrated into the new Statime, to provide its PTP support.

### When will this happen and what are the consequences?

We are planning to release the new 2.0 version, with new features and breaking changes, in December 2026. Subsequent non-breaking 2.x versions will introduce additional features in January 2027.

With the rename, we will also retire the name "Pendulum" as the umbrella under which our NTP and PTP software lived, as well as the GitHub organization "project-pendulum". After the rename, the new software will live in Trifecta Tech Foundation's GitHub organization: [github.com/trifectatechfoundation](https://github.com/trifectatechfoundation). The GitHub org and repo renames should not affect you, as GitHub handles redirection.

An overview of the name changes:

| What          | Old name                                                    | New name   |
|---------------|-------------------------------------------------------------|------------|
| Binaries      | `ntp-daemon`, `ntp-ctl`, `ntp-metrics-exporter`             | TODO `statime`, `statime-metrics`, `statime-ctl` |
| Binaries      | `statime-linux`                                             | no longer used |
| systemd units | `ntpd-rs.service`, `ntpd-rs-metrics.service`                | `statime.service`, `statime-metrics.service` |
| Crates        | `ntpd`, `ntp-proto`                                         | TBD, `statime-ntp` |
| Crates        | `statime`                                                   | `statime-ptp`|
| Repositories  | `pendulum-project/ntpd-rs`                                  | `trifectatechfoundation/statime` |
| Repositories  | `pendulum-project/statime`                                  | archived |
| Documentation | `docs.ntpd-rs.pendulum-project.org`                         | `docs.statime.trifectatech.org` |

A migration guide will be added to our documentation when the 2.0 is released.

If you have questions about how the rename of binaries, systemd units, crates, and repositories affects you, please reach out to us by opening an issue or a discussion on GitHub. You can also reach us via [contact@trifectatech.org](mailto:contact@trifectatech.org).

Stay tuned for the follow-up blog post!
