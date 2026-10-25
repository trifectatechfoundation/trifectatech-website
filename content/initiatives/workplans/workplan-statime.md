+++
title = "Statime"
slug = "statime"
template = "initiatives/workplans/workplan.html"

[extra]
backLink = "projects/statime"
backTitle = "Back to project: Statime"
+++

## Roadmap

- 2026 Q3: [Experimental Client Server PTP with NTS in ntpd-rs](#milestone-4-client-server-ptp) (funded by Meinberg)
- 2026 Q3: [Clock synchronization library](#milestone-5-clock-synchronization-library) (funded by [NLnet](https://nlnet.nl/project/ntpd-rs-NTPv5/))
- 2027: [Automotive profile](#milestone-6-automotive-profile) (pending funding)

---

## In progress milestones

### Milestone 4: Client Server PTP

This milestone will add experimental Client Server PTP with NTS to ntpd-rs using the Statime library.
During 2026, as the IEEE spec evolves, the implementation will be updated.

* Experimental implementation for Client Server PTP in ntpd-rs
* Updates to the implementation as the spec evolves

This work is supported by [Meinberg](https://www.meinbergglobal.com/).

### Milestone 5: Clock synchronization library

This milestone will extract shared clock synchronization functionality in ntpd-rs and and Statime. The result is a new library with potentially small improvements to clock synchronization performance.

* More details soon

This work is supported by [NLnet](https://nlnet.nl/project/ntpd-rs-NTPv5/).

--- 

## Future work

### Milestone 6: Automotive profile

This milestone adds the automotive profile to the statime library and deamon, according to Automotive Ethernet AVB.

- **Implementation:** Support for Generalized Precision Time Protocol (gPTP)
- **Improvements:** Automotive specific fixes for Automotive Ethernet AVB
- **Documentation:** Documentation of automotive profile options and example configuration

Status: *Pending funding*. Requested funding €17.500.