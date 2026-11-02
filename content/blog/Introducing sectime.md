+++
title = "Introducing sectime.org: a pool of secure time servers"
slug = "sectime-org-a-pool-of-secure-time-servers"
authors = ["Ruben Nijveld", "Erik Jonkers"]
date = "2026-11-03"

[taxonomies]
tags = ["nts-pool", "time synchronization"] 

+++

**Trifecta Tech Foundation has launched [sectime.org](https://sectime.org), a public pool of secure NTS servers, with the goal of eventually providing secure time synchronization by default for all devices on the internet.**

<!-- more -->

### Why does it matter?
Time synchronization has traditionally happened over unsecured protocols. Even today most time synchronization over the internet is done via unsecured NTP (Network Time Protocol) packets. But the internet has changed, and unsecured protocols are no longer sufficient given the threats the modern digital world faces. 

A secure variant of NTP already exists, NTS (Network Time Security), but its adoption has been low at best. We believe that NTS should become the new default for most computers on the internet, just as HTTP was replaced with encrypted HTTPS.

### A default location for secure time
A major obstacle to NTS adoption is the lack of a good default location. For unsecured NTP, many vendors use the well-known [NTP pool](https://www.ntppool.org/en/), `pool.ntp.org`, as their default setting. This pool, however, cannot provide access to secure servers, due to the design of NTS. In short, for secure time, no standard pool exists and vendors cannot pick an NTS server suitable for all of their clients.

This is why we’ve been working on alternative pooling solutions for NTS over the past two years, designed to provide free access to secure time for everyone. 

Today, we are proud to introduce **[sectime.org](https://sectime.org)**, a pool of secure time servers!

### Join sectime.org
sectime.org, like the NTP pool, relies on organizations and volunteers for hosting servers. You can help sectime.org grow by adding your server. Or, if you are looking for a secure time source for your devices, you can start using sectime.org now.

For full instructions on how to join or use the pool, go to the [sectime.org](https://sectime.org) website.

*<span style="padding: 10px;display: inline-block;font-size: smaller; border: 1px solid rgba( 230, 154, 141, 0.5)">Note: existing time sync utilities don’t yet support NTS pooling for all use cases. For the remaining cases, we provide modified versions of well-known utilities, chrony and NTPsec, alongside our own implementation, ntpd-rs, which has full support out of the box.</span>* 

### Thank you
This project is funded by the Internet Corporation for Assigned Names and Numbers (ICANN) through the ICANN Grant Program. Thanks to its support, sectime.org now implements both NTS pool proposals we introduced in an earlier blog post, [Enabling pools in NTS](https://trifectatech.org/blog/enabling-pools-in-nts/).   


### What's next
Work on the project continues; our project partner [SIDN](https://www.sidnlabs.nl/en) is conducting measurements to report on the behavior of both pooling solutions, while we work on scaling sectime.org. We will publish a technical blog post soon that details the pros and cons of both proposals. Stay tuned!

For now, we invite anyone to [join our pool](https://sectime.org/), either as a server or as a client!

---

### About 
Trifecta Tech Foundation is a non-profit and a Public Benefit Organization (501(c)(3) equivalent) that creates open-source building blocks for critical infrastructure software. Our initiatives on data compression, time synchronization, and privilege boundary impact the digital security of millions of people. If you’d like to support our work, please contact us; see [trifectatech.org/support](https://trifectatech.org/support).