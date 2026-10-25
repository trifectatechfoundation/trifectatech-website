+++
title = "NTS Pool"
slug = "nts-pool"
template = "projects/project.html"

[extra]
summary = "<p>A pool management system for NTS servers.</p>"

initiative = { name = "Time Synchronization", slug = "/initiatives/time-synchronization" }

links = [
    { name = "GitHub", href = "https://github.com/pendulum-project/nts-pool" },
    { name = "Roadmap", href = "#roadmap" },
    { name = "News", href = "#news" },
]

funders = [
    "icann"
]

supporters = [
    "sta"
]

blogposts = [
    "Video: Securing time with NTS (FOSDEM26)",
    "Enabling pools in NTS",
    "A safe Internet requires secure time"
]
+++

The Network Time Protocol is generally used completely unprotected, much like the web was before HTTPS; if our devices were to receive a manipulated timestamp, they wouldn’t know.

This project provides a pool management system for NTS servers to facilitate the adoption of Network Time Security (NTS), with the goal to eventually solve the problem of unprotected time on the internet.

NTS Pool is part of our [Time synchronization initiative](/initiatives/time-synchronization/).

### What we've done

In 2024, we first wrote about [the importance of secure time synchronization](https://trifectatech.org/blog/a-safe-internet-requires-secure-time/) and [our proposed solutions for pools of NTS (Network Time Security) servers](https://trifectatech.org/blog/enabling-pools-in-nts/) aimed at increasing NTS adoption. Thanks to an investment from [Sovereign Tech Agency](https://sovereign.tech) our maintainers proposed an IETF standard and experimented with an implementation.

In 2025, the ICANN Grant Program supported our project [Secure time for a Safe Internet](https://www.icann.org/en/grant-program/first-cycle-funded-projects#secure-time-safe-internet) for the development of services that implemenent two proposals for NTS pooling. The project will complete in early 2027.

### Roadmap

- Q3 2026: Experimental service for NTS pooling
- Q4 2026: Stable service for NTS pooling
- Q1 2027: Completion of the [Secure time for a Safe Internet](https://www.icann.org/en/grant-program/first-cycle-funded-projects#secure-time-safe-internet) project
- Q2-Q4 2027: Scaling of NTS pool services (pending funding)

### Support us

Please [get in touch with us](/support), if you are interested in financially supporting us.
