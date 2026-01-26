+++
title = "zlib-rs: stable API"
slug = "zlib-rs-stable-api"
authors = ["Folkert de Vries"]
date = "2026-01-26"

[taxonomies]
tags = ["zlib-rs", "data compression"] 

+++

We've released zlib-rs version 0.6, the first version with a stable and complete API.

https://docs.rs/zlib-rs/0.6.0/zlib_rs/

Furthermore, zlib-rs recently crossed 30M downloads, and is on track to become the default implementation in `flate2`. Below are some highlights of this release. The full release notes are at:

https://github.com/trifectatechfoundation/zlib-rs/releases/tag/v0.6.0

<!-- more -->

## `zlib-rs`

The `zlib-rs` crate now has a stable API. It hides away most of the internals, but exposes enough for `flate2` and `rustls`. Generally we recommend to use `zlib-rs` via `flate2` in applications, but for truly low-level libraries using `zlib-rs` directly is now an option.

Additionally `flate2` now uses the `zlib-rs` CRC32 checksum implementation when `zlib-rs` is used. That saves a dependency, which is always nice.

## `libz-rs-sys`

The `libz-rs-sys` crate is a C-compatible API built on top of `zlib-rs`. It can be compiled into a drop-in compatible C library.

### ABI changes

All exported functions now use `extern "C"` instead of `extern "C-unwind"`.

This is a change we've wanted to make for a while, but held off on because we had rust crates using `libz-rs-sys`. Now that they instead use `zlib-rs` directly, we can focus more on C users in the `libz-rs-sys` crate.

Normally, when rust functions panic, they start unwinding the stack. That is only valid when the caller anticipates that the callee might unwind. For rust functions this case is handled, but when exporting a function, the caller is likely not written in rust, and does not support stack unwinding. 

If the callee does unwind, behavior is undefined. Although `libz-rs-sys` should not panic, causing UB when we somehow do is a massive footgun. So now we use `extern "C"`, which will instead abort the program at the FFI boundary. 

### Support for `gz*` functions

We've added functions like `gzread`, `gzwrite` and many others to the `libz-rs-sys` API. These were already available in `libz-rs-sys-cdylib`, and have now been promoted. Use the `gz` feature to expose them. Most of these functions were implemented by [@brian-pane](https://github.com/brian-pane).

In addition, we've implemented several other missing functions (like `inflateBack`), so that we're now fully compatible with the zlib and zlib-ng public API.

## What's next

Although the public API is now complete, a project like this is never truly done. There are always new optimization ideas to try, versions to update, and obscure edge cases to support.

The biggest remaining items is that technically the API is only complete when using nightly rust. The `gzprintf` and `gzvprintf` functions are c-variadic, and c-variadic function definitions are currently unstable. I hope to stabilize [`#[feature(c_variadic)]`](https://github.com/rust-lang/rust/issues/44930) in the next ~6 months.