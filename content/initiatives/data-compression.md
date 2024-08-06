+++
title = "Data compression"
slug = "data-compression"
template = "initiatives/data-compression.html"
+++

### Building a data compression ecosystem

Compression algorithms are used in a vast number of protocols and file formats throughout all of computing. Implemented in C, these libraries encounter regular security issues despite receiving extensive industry-wide scrutiny.

Our initiative aims to create memory-safe implementations of compression libraries:

- bzip2
- zlib: A widely-used compression library, used primarily on the web to provide gzip compression to the text/html/js/css we send around.
- **xz**: A compression format that provides very good compression, but relatively slow. Commonly used for large file downloads.
- zstd: A modern successor to zlib, providing better compression faster. 


### What We've Done

For zlib, we've created an initial implementation based on zlib-ng, called zlib-rs, with a focus on maintaining excellent performance while introducing memory safety.

TODO: mention Prossimo.

In April 2024, zlib-rs was ....

### What's Next

We currenly seek support for continuing zlib development and starting work on bzip2, xz and zstd.   

The high level goals for the four projects are:

- provide a pure rust implementation to rust users
- provide a compatible dynamic library that has compiled rust code inside
- on par performance

The total funding target for this initiative is € 495.000,-   

### Workplan

For per project details, see [the workplan](/initiatives/workplan-data-compression).

### Links

- video & slides
- [zlib-rs GitHub Repository](https://github.com/memorysafety/zlib-rs/)
- [zlib-rs Prossimo initiative](https://www.memorysafety.org/initiative/zlib/)

        