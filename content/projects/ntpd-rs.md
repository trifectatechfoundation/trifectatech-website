+++
title = "ntpd-rs"
slug = "ntpd-rs"
template = "projects/project.html"

[extra]
summary = "<p>Tbd</p>"

links = [
    { name = "GitHub", href = "https://github.com/pendulum-project/ntpd-rs" },
    { name = "Docs", href = "https://docs.ntpd-rs.pendulum-project.org/" },
    { name = "Roadmap", href = "#roadmap" },
    { name = "News", href = "#news" }
]

funders = [
    "nlnetfoundation",
    "ngi-zero-core",
    "meinberg"
]

supporters = [
    "sta",
    "prossimo",
    "sidnfonds",
    "ngi-assure",
    "tweedegolf",
    "aws"
]

blogposts = [
    "Announcing ntpd-rs in Ubuntu",
    "ntpd-rs now supports version 5 of the Network Time Protocol",
    "More Memory Safety for Let’s Encrypt: Deploying ntpd-rs",
    "Providing official Fedora Linux RPM packages for ntpd-rs and sudo-rs",
    "Sovereign Tech Fund invests in Pendulum"
]
+++

ntpd-rs is a tool for synchronizing your computer's clock, implementing the Network Time Protocol (NTP) and Network Time Security (NTS) protocols. It is written in Rust, with a focus on security and stability, and includes both client and server support.

ntpd-rs is part of our [Time synchronization initiative](/initiatives/time-synchronization/).

### What we've done

ntpd-rs, is stable. It is packaged for, for example, Fedora, Debian and Ubuntu and [deployed at Let's Encrypt](https://letsencrypt.org/2024/06/24/ntpd-rs-deployment).

## What's next

2026 will see major developments for ntpd-rs, including support for NTS pooling and CSPTP, resulting in the release of ntpd-rs 2.0 at the end of the year.

Additionally, work is in progress to support PTP in ntpd-rs as part of our quest to create a single time synchronization utility that supports both NTP and PTP.

### Roadmap

- 2026 Q3: Support for [NTS extensions for enabling pools](https://datatracker.ietf.org/doc/draft-venhoek-nts-pool/) in ntpd-rs
- 2026 Q4: Experimental Client Server PTP with NTS (funded by [Meinberg](https://www.meinbergglobal.com/))
- 2026 Q4: New clock synchronization library (funded by [NLnet](https://nlnet.nl/project/ntpd-rs-NTPv5/))
- 2027 Q1: Release of ntpd-rs 2.0

### History

The initial development of ntpd-rs was started and funded by the [Internet Security Research Group](https://www.abetterinternet.org/) as part of the [Prossimo project](https://www.memorysafety.org/).

### Support us

Please [get in touch with us](/support), if you are interested in financially supporting us.
