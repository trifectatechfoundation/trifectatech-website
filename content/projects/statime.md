+++
title = "Statime"
slug = "statime"
template = "projects/project.html"

[extra]
summary = "<p>Tbd</p>"

links = [
    { name = "GitHub", href = "https://github.com/pendulum-project/statime" },
    { name = "Docs", href = "https://docs.statime.pendulum-project.org/" },
    { name = "Roadmap", href = "#roadmap" },
    { name = "News", href = "#news" }
]

funders = [
    "nlnetfoundation", 
    "meinberg"
]

supporters = [
    "sta",
    "ngi-assure",
    "sidnfonds"
]

blogposts = [
    "ISPCS paper: Estimating noise for clock-synchronizing Kalman filters",
    "Statime vs Linux PTP - Comparison of precision",
    "Sovereign Tech Fund invests in Pendulum"
]
+++

Statime is a library providing an implementation of the Precision Time Protocol, version 2.1 (IEEE1588-2019). It provides all the building blocks to setup PTP ordinary and boundary clocks. On modern Linux kernels, the `statime-linux` crate provides a ready to use PTP daemon.

Statime is part of our [Time synchronization initiative](/initiatives/time-synchronization/). 

### What we've done

The development of Statime started in 2022 with funding from [NLnet Foundation](https://nlnet.nl), resulting in the initial release supporting a slave-only PTP ordinary clock. 

Over the next two years Statime evolved towards a feature-complete PTP implementation, supporting the Default and Data Centre profiles. We achieved [on-par clock stability with Linux PTP](https://tweedegolf.nl/en/blog/129/statime-vs-linux-ptp-comparison-of-precision).

Statime now provides strong synchronization performance and accurate synchronization error estimates without manual tuning. See the paper [Estimating noise for clock-synchronizing Kalman filters](https://tweedegolf.nl/en/blog/138/ispcs-paper-estimating-noise-for-clock-synchronizing-kalman-filters).

In late 2025, we started the experimental implementation of the novel [Client Server PTP](https://standards.ieee.org/ieee/1588.1/11644/) (CSPTP) in [ntpd-rs](/projects/ntpd-rs), using the Statime library.

### Roadmap

- 2026 Q1: Experimental Client Server PTP with NTS in ntpd-rs (funded by Meinberg)
- 2026 Q2: Clock synchronization library (funded by [NLnet](https://nlnet.nl/project/ntpd-rs-NTPv5/))
- 2026 Q4: Stable release of statime-linux (pending funding)
- 2026 Q4: Automotive profile (pending funding)
- 2027 Q1: Stable release of statime library (pending funding)

For milestone details see [the Statime workplan](/initiatives/workplans/statime/).

### Support us

Please [get in touch with us](/support), if you are interested in financially supporting us.
