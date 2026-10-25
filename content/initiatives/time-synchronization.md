+++
title = "Time synchronization"
slug = "time-synchronization"
template = "initiatives/initiative.html"

[taxonomies]
category = ["infrastructure"]

[extra]
summary = "<p>Reliable, securely synchronized time is a building block for the Internet and other critical infrastructure.</p>"

projects = [
    "ntpd-rs",
    "statime",
    "nts-pool"
]

funders = [
    "nlnetfoundation",
    "ngi-zero-core",
    "canonical",
    "icann"
]

supporters = [
    "sta",
    "prossimo",
    "sidnfonds",
    "ngi-zero-entrust",
    "ngi-assure",
    "tweedegolf",
    "aws"
]

blogposts = [
    "Announcing ntpd-rs in Ubuntu",
    "Video: Securing time with NTS (FOSDEM26)",
    "ntpd-rs now supports version 5 of the Network Time Protocol",
    "Enabling pools in NTS",
    "ISPCS paper: Estimating noise for clock-synchronizing Kalman filters",
    "More Memory Safety for Let’s Encrypt: Deploying ntpd-rs",
    "A safe Internet requires secure time",
    "Providing official Fedora Linux RPM packages for ntpd-rs and sudo-rs",
    "Sovereign Tech Fund invests in Pendulum"
]
+++

Reliable, securely synchronized time is a building block for the Internet and other critical infrastructure.

This initiative provides modern, memory-safe implementations of the Network Time Protocol and Precision Time Protocol and creates open services that boost secure time synchronization.

### What We've Done

Our Network Time Protocol implementation, ntpd-rs, is stable. It is packaged for, for example, Fedora, Debian and Ubuntu and [deployed at Let's Encrypt](https://letsencrypt.org/2024/06/24/ntpd-rs-deployment).

In 2025, we started work on a pool management system for NTS servers to facilitate the adoption of Network Time Security (NTS). This project completes in early 2027, see the [NTS Pool](/projects/nts-pool) project page.

In July of 2026, work started to prepare ntpd-rs to become [the default time synchronization utility on Ubuntu](/blog/announcing-ntpd-rs-as-default-on-ubuntu/).

### Roadmap

See the [ntpd-rs](/projects/ntpd-rs), [Statime](/projects/statime) and [NTS Pool](/projects/nts-pool) project pages.




        
