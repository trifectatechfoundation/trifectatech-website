+++
title = "Smart grid protocols"
slug = "automated-demand-response"
template = "initiatives/initiative.html"

[taxonomies]
category = ["infrastructure"]

[extra]

summary = "<p>Secure smart grid protocols like OpenADR are crucial for the energy transition.</p>"

funders = [
 "tweedegolf",   
 "elaadnl",
]

supporters = [
]

blogposts = [
]
+++

### Smart grid protocols: OpenADR

As the electrification of our society goes on and the use of distributed energy resources increases, secure smart grid protocols are becoming vital to optimize the use of our existing physical grid infrastructure. 

One of such protocols is OpenADR, wich stands for Open Automated Demand Reponse. An open standard / protocol developed by the [OpenADR Alliance](https://www.openadr.org/). 

OpenADR allows Distribution System Operators (DSOs) to implement so-called demand response programs, allowing them to reduce peak loads and alleviate pressure on the grid  through sending price signals or usage limits to large consumers when needed.


Our project, called [OpenLEADR-rs](https://github.com/OpenLEADR/openleadr-rs), offers an open source implementation of **OpenADR version 3**, that is suitable for many environments. Written in Rust, it's a lightweight and reliable a building block for a multitude of digital products and services underpinning the energy transition.

### What We've Done

[Tweede golf](https://tweedegolf.nl/en) started development in **June 2024** with initial funding from [ElaadNL](https://elaad.nl/en/), the Knowledge & Innovation center for the joint Dutch grid operators that researches and tests smart and sustainable charging of electric vehicles.

To enable global collaboration and ensure neutral governance, the project became part of the [Linux Energy Foundation OpenLEADR](https://lfenergy.org/projects/openleadr/) project  in **October 2024**.


### Current Status

As of August 2025, the project is **gaining traction**, in particular in the Netherlands. Funding for maintenance until mid-2026 has been secured. Additionally, the project is **actively seeking funding** for:

### Priorities

+ Publishing an official field-test-ready release
+ Implementating OpenADR 3.1
+ Implementating an alternative (non-MQTT) notification mechanism
+ Improved testing infrastructure
+ Continued involvement in the development of the OpenADR specification
+ Continued community building and contributor support

### Get in touch!

If this work is valuable to you, please consider funding the project. Please [get in touch with us](/support) to learn more.

### Links

- [January 2025 article blog post](https://tweedegolf.nl/en/blog/146/openleadr-3-0-initial-traction-and-future-plans)
- [November 2024 LF Energy announcement](https://lfenergy.org/rust-implementation-of-openadr-3-0-becomes-part-of-openleadr/)
- [Project's GitHub repository](https://github.com/OpenLEADR/openleadr-rs) (called openleadr-rs)
- [LF Energy OpenLEADR website](https://openleadr.org/)
- [LF Energy OpenLEADR project page](https://lfenergy.org/projects/openleadr/)
- [LF Energy Slack](https://lfenergy.slack.com/archives/C045K9YGX52)
