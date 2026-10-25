+++
title = "OxiSH: memory-safe SSH server"
slug = "oxish"
template = "projects/project.html"

[extra]
summary = "<p>OxiSH is a modern, memory-safe SSH server. It is written in Rust, with a safe sans-I/O protocol core and an abstraction for the underlying cryptography primitives.</p>"

links = [
    { name = "GitHub", href = "https://github.com/djc/oxish" },
    { name = "Roadmap", href = "#roadmap" },
    { name = "News", href = "#news" }
]

funders = [
    "sta"
]

supporters = [
]

blogposts = [
    "OxiSH a modern memory-safe SSH server"
]
+++

OxiSH is a modern, memory-safe SSH server. SSH servers perform a critical function on the security boundary of almost every open-source operating system that powers the Internet.

The project was created to offer a memory-safe alternative to the predominant C implementation [OpenSSH](https://www.openssh.org/). OpenSSH has been around for decades but continues to suffer from memory safety issues to this day. 

OxiSH is written in Rust, has a safe sans-I/O protocol core and an abstraction for the underlying cryptography primitives. It is part of our [Privilege Boundary initiative](/initiatives/privilege-boundary/), and is in the early stages of development.

### What we've done

OxiSH was created by Dirkjan Ochtman in 2025 and he has written most of the code. In early 2026, Trifecta Tech Foundation engineers worked with Dirkjan on OxiSH, supported by an investment by [Sovereign Tech Agency](https://www.sovereign.tech/). TTF's contributions included an initial draft of privilege separation and terminal handling.

Dirkjan announced the initial version of OxiSH in August of 2026, see his blog post ["OxiSH: a modern, memory-safe SSH server"](https://dirkjan.ochtman.nl/writing/2026/08/13/announcing-oxish.html).

### What's next

Starting November 2026, Trifecta Tech Foundation and Dirkjan will jointly work on a new major version of the project, with a release planned in Q2 2027.

### Support us

The project continues to look for investments and sponsorship to reach the production-ready state. Please [get in touch with us](/support), if you are interested in financially supporting us.

### Roadmap

- Q4 2026: Start joint development phase
- Q2 2027: Beta release
- Q4 2027: Production-ready release (pending funding) 

