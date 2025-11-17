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
    "ngi-zero-core"
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

### Roadmap

- 2025 Q3-Q4: Support for NTPv5, updated as the spec evolves
- 2025 Q4: Support for [NTS extensions for enabling pools](https://datatracker.ietf.org/doc/draft-venhoek-nts-pool/)
- 2026 Q1: Experimental Client Server PTP with NTS (funded by Meinberg)
- 2026 Q2: Clock synchronization library (funded by [NLnet](https://nlnet.nl/project/ntpd-rs-NTPv5/))

### History

The initial development of ntpd-rs was started and funded by the [Internet Security Research Group](https://www.abetterinternet.org/) as part of the [Prossimo project](https://www.memorysafety.org/).

### Support us

Please [get in touch with us](/support), if you are interested in financially supporting us.
