+++
title = "Statime"
slug = "statime"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "projects/statime"
backTitle = "Back to project: Statime"
+++

## Roadmap

- 2026 Q1: [Experimental support for Client Server PTP in ntpd-rs](#milestone-4-client-server-ptp) (funded by Meinberg)
- 2026 Q2: [Clock synchronization library](#milestone-5-clock-synchronization-library) (funded by [NLnet](https://nlnet.nl/project/ntpd-rs-NTPv5/))
- 2026 Q3: [Stable release of statime-linux](#milestone-6-stable-release-of-statime-linux) (pending funding)
- 2026 Q3: [Automotive profile](#milestone-7-automotive-profile) (pending funding)
- 2026 Q4: [Stable release of statime library](#milestone-8-stable-release-of-statime-library) (pending funding)

---

## In progress milestones

### Milestone 4: Client Server PTP

* Experimental implementation for Client Server PTP in ntpd-rs
* Updates to the implementation as the spec evolves

This work is supported by [Meinberg](https://www.meinbergglobal.com/).

### Milestone 5: Clock synchronization library

This work is supported by [NLnet](https://nlnet.nl/project/ntpd-rs-NTPv5/).

--- 

## Future work

### Milestone 6: Stable release of statime-linux

The statime-linux is Statime's PTP daemon for Linux distributions. This milestone gets statime-linux ready for mainstream adoption.

- **Binary:**: logs, config, observability improvements, statime-ctl	
- **Binary docs:**: getting started, migration guide from PTP4Linux, config reference	
- **Testing:**: improve coverage and fuzzing	 

Status: *Pending funding*. Requested funding €37.500.

### Milestone 7: Automotive profile

This milestone adds the automotive profile to the statime library and deamon, according to Automotive Ethernet AVB.

- **Implementation:** Support for Generalized Precision Time Protocol (gPTP)
- **Improvements:** Automotive specific fixes for Automotive Ethernet AVB
- **Documentation:** Documentation of automotive profile options and example configuration

Status: *Pending funding*. Requested funding €17.500.

### Milestone 8: Stable release of statime library

The statime library is stabilized in this milestone, adding API improvements and documentation.

- **Library:**: API improvements
- **Library docs:**: examples, API docs, API guides

Status: *Pending funding*. Requested funding €17.500.