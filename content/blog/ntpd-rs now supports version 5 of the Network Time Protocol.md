+++
title = "ntpd-rs now supports version 5 of the Network Time Protocol"
slug = "ntpd-rs-now-supports-version-5-of-the-network-time-protocol"
authors = ["Ruben Nijveld","Erik Jonkers"]
date = "2025-07-11"

[taxonomies]
tags = ["ntpd-rs", "time-synchronization"] 

[extra]
image = "/blog/ntpv5.jpg"

+++

![NTP version 5](/blog/ntpv5.jpg)

Our Network Time Protocol implementation, **[ntpd-rs](https://github.com/pendulum-project/ntpd-rs/)**, now provides expertimental support of NTP version 5. It is available in the [latest release](https://github.com/pendulum-project/ntpd-rs/releases/tag/v1.6.0).

<!-- more -->

The specification of version 5 has been under development at the [Internet Engineering Task Force (IETF)](https://www.ietf.org/) for a couple of years. As the draft spec is nearing maturity, we feel it is time for a release in the wild.

## What is NTPv5?

NTPv5 is the next major revision of the [Network Time Protocol (NTP)](https://en.wikipedia.org/wiki/Network_Time_Protocol). NTP is a foundational internet technology that allows hosts - billions of phones, computers, laptops and servers - to obtain the current time of day from time servers.

## Try it

You can now use ntpd-rs as an NTPv5 client or server. Keep in mind that the functionality is still experimental, and therefore not enabled by default. 

Try NTPv5 in ntpd-rs by setting `ntp-version` for your client and `accept-ntp-versions` for your server. Our new NTPv5 guide has the details: 
[docs.ntpd-rs.pendulum-project.org/guide/ntpv5/](https://docs.ntpd-rs.pendulum-project.org/guide/ntpv5/)

## What's new?

Simply put, as the specification states, NTPv5 improves "protocol robustness and clarity".

A list of notable changes:

- NTPv5 only describes the on-wire protocol, omitting any of the algorithm details that were in the previous versions (none of the major NTP implementations follow these details precisely, as they are known to be suboptimal).
- Support for anything but client and server modes is dropped (ntpd-rs already only supports these modes).
- Fields in the NTP server and client messages have been defined more clearly.
- NTPv5 has a better mechanism for handling loop detection.
- Several other minor improvements and changes.

Dropping the other modes has robustness benefits and reduces attack surface, as the spec mentions:

> The symmetric and broadcast modes are vulnerable to replay attacks. The control and private modes can be exploited for denial-of-service traffic amplification attacks. 

You can read the full spec (draft 04) on the IEFT website: [datatracker.ietf.org/doc/draft-ietf-ntp-ntpv5/04/](https://datatracker.ietf.org/doc/draft-ietf-ntp-ntpv5/04/). 

We thank the authors, M. Lichvar (the maintainer of [chrony](https://chrony-project.org/)) and T. Mizrahi, and the members of the [Network Time Protocols WG](https://datatracker.ietf.org/wg/ntp/about/) for their excellent work.

## Conclusion

We believe that NTPv5 is a significant improvement over NTPv4 and we look forward to the moment the draft is finalized and version 5 is supported by all major NTP implementations.

Meanwhile we aim to continue contributing to that process in the Network Time Protocols working group. Later this month, we will attend the [IETF 123](https://www.ietf.org/meeting/123/) in Madrid; come find us to collaborate or to talk.

In case you try NTPv5 in ntpd-rs, we invite you to share your experience, for example by opening a discussion or issue [in our repository](https://github.com/pendulum-project/ntpd-rs/discussions). 

Last but not least, we'd like to thank the [NLnet Foundation](https://nlnet/nl) and [Sovereign Tech Agency](https://www.sovereign.tech/) for their support in developing the NTPv5 implementation in ntpd-rs.

---

## About Trifecta Tech Foundation

[**Trifecta Tech Foundation**](https://trifectatech.org) is a non-profit and a Public Benefit Organisation (501(c)(3) equivalant) that creates open-source building blocks for critical infrastructure software. Our initiatives Data compression, Time synchronization, Smart grid protocols and Privilege boundary, impact the digital security of millions of people. If you'd like to support our work, please contact us; see [trifectatech.org/support](https://trifectatech.org/support/).
