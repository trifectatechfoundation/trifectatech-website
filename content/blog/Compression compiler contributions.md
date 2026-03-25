+++
title = "Compression compiler contributions"
slug = "compression-compiler-contributions"
authors = ["Folkert de Vries"]
date = "2026-03-27"

[taxonomies]
tags = ["bzip2-rs", "zlib-rs", "zstd-rs", "data compression"] 

+++

Our work on using Rust in places where C is traditionally used frequently makes us hit limitations in Rust itself and the surrounding tooling. Over the years, we've become increasingly comfortable with fixing these issues ourselves.

<!-- more -->

Previously we have at times felt stuck by missing functionality in stable Rust, without a clear path forwards except to wait. In practice waiting has not turned out to be a fruitful strategy: the features that we need are niche, and rarely make it to the top of the to-do list of other Rust maintainers. 

This post goes over some of the fixes and improvements that we've made as a part of Trifecta's compression initiative (`zlib-rs`, `libbzip2-rs` and `libzstd-rs-sys`) over the past year.

At RustWeek I'll give a talk about ["stabilizing decade-old features"](https://2026.rustweek.org/talks/folkert/) with advice on how to start making these kinds of contributions yourself.
### Contributions to `clippy`

We often use [c2rust](https://github.com/immunant/c2rust), an automatic translation tool that converts C to Rust. The Rust it produces is behaviorally equivalent to the C code, but far from idiomatic.

We get a lot of value out of clippy not only flagging issues, but increasingly being able to fix them. We often run commands like the one below to only fix one or a couple of lints at a time, and bundle those in a commit that is easier to review than just fixing all lints at once.

```
 cargo clippy --fix -- --allow clippy::all --warn clippy::manual_div_ceil
```

Sometimes the code that `c2rust` produces is so cursed that applying the `clippy --fix` produces invalid code. In [https://github.com/rust-lang/rust-clippy/pull/15304](https://github.com/rust-lang/rust-clippy/pull/15304) we fixed a bug where parentheses would cause `clippy::collapsible_if` to apply an incorrect suggestion:

```
warning: this `if` statement can be collapsed
  --> src/main.rs:6:5
   |
 6 | /     if true {
 7 | |         (if true {
 8 | |             ()
 9 | |         })
10 | |     }
   | |_____^
   |
   = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#collapsible_if
   = note: `#[warn(clippy::collapsible_if)]` on by default
help: collapse nested if block
   |
 6 ~     if true
 7 ~         &&f true {
 8 |             ()
 9 ~         })
   |
```

In other cases we spot a rewrite that isn't covered by an existing lint, but that does seem generally useful. For instance, the `c2rust` output contains lots of pointer arithmetic, like this:

```rust
foo.offset(4)
```

The `ptr_offset_by_literal` lint, added in [https://github.com/rust-lang/rust-clippy/pull/15606](https://github.com/rust-lang/rust-clippy/pull/15606), rewrites this to:

```rust
foo.add(4)
```

Code using only `ptr::add` and not `ptr::sub` is much easier to convert to using slices.

Along the way it turned out that the implementation of the related `ptr_offset_with_cast` lint, on which I heavily based my initial implementation, had accumulated some technical debt. My changes fell right in the middle of the [clippy feature freeze](https://blog.rust-lang.org/inside-rust/2025/06/21/announcing-the-clippy-feature-freeze/), so it was a perfect moment to fix that up too in [https://github.com/rust-lang/rust-clippy/pull/15613](https://github.com/rust-lang/rust-clippy/pull/15613).

## Contributions to Miri

### Improved intrinsic support

We use Miri to test the unsafe code that we still have. I recently wrote about our work on [emulating avx-512 intrinsics in Miri](https://trifectatech.org/blog/emulating-avx-512-intrinsics-in-miri/). Since then we've added support for a couple additional instructions for our `avx512vnni` implementation of adler32. 

My next goal is to also be able to run the zlib-rs AArch64 SIMD tests with Miri. For now that'll need some additional support in Miri itself, but with LLVM 23 we'll be able to only use portable intrinsics and the custom Miri support should no longer be needed.

I want to stress that the Miri implementation is really only half the work. The other half is testing the implementation (sometimes giving rise to improving tests in e.g. `rust-lang/stdarch` as well), to make sure that the behavior is correct and that support never regresses.

### ICE when reading from a static array of function pointers

In the first week of working on [libzstd-rs-sys](https://github.com/trifectatechfoundation/libzstd-rs-sys) we ran into `c2rust` producing some Rust code that Miri was unable to handle.  

[https://github.com/rust-lang/miri/issues/4501](https://github.com/rust-lang/miri/issues/4501)

This (cursed) static initialization code threw an internal compiler error in Miri. This was fixed by Ralf Jung.

```rust
unsafe extern "C" fn run_static_initializers() {}

#[used]
#[cfg_attr(target_os = "linux", unsafe(link_section = ".init_array"))]
#[cfg_attr(target_os = "windows", unsafe(link_section = ".CRT$XIB"))]
#[cfg_attr(target_os = "macos", unsafe(link_section = "__DATA,__mod_init_func"))]
static INIT_ARRAY: [unsafe extern "C" fn(); 1] = [run_static_initializers];

fn main() {}
```

### Missing support for `libc::memset`

[https://github.com/rust-lang/miri/issues/4503](https://github.com/rust-lang/miri/issues/4503)

Miri supports some `libc` functions, like `memcpy`, but `memset` was missing. Newly `c2rust`-translated code would often hit a call to `memset` and fail early without running (and potentially finding errors in) the majority of the program. Support for `memset` was added by Vishruth Thimmaiah.

## Larger Features

We've also contributed substantially to some larger features that we believe Rust should have to be an effective systems programming language. Note that these bigger features are never solo projects, they contain the (indirect) work of many contributors.

### `#![feature(cfg_select)]`

[https://github.com/rust-lang/rust/issues/152944](https://github.com/rust-lang/rust/issues/152944)

A much nicer way to write configuration predicates:

```rust
cfg_select! {
    unix => {
        fn foo() { /* unix specific functionality */ }
    }
    target_pointer_width = "32" => {
        fn foo() { /* non-unix, 32-bit functionality */ }
    }
    _ => {
        fn foo() { /* fallback implementation */ }
    }
}

let is_unix_str = cfg_select! {
    unix => "unix",
    _ => "not unix",
};
```

We already use a custom version of this macro in some of our crates, but in rust 1.95 it will finally be available from std on stable Rust. I worked on implementing this macro as a built-in macro in the Rust compiler, and getting it through the stabilization process.
### `#![feature(c_variadic)]`

[https://github.com/rust-lang/rust/issues/44930](https://github.com/rust-lang/rust/issues/44930)

Rust can call c-variadic functions (like `libc::printf`), but defining them is unstable. This feature is required for completing the zlib-rs C api where we have these functions:

```rust
pub unsafe extern "C" fn gzprintf(
    file: gzFile, 
    format: *const c_char,
    va: ...) -> c_int {
    unsafe { gzvprintf(file, format, va) }
}

unsafe extern "C" fn gzvprintf(
    file: gzFile,
    format: *const c_char,
    va: core::ffi::VaList,
) -> c_int {
    /* ... */
}
```

My work on this feature started after the 2025 all-hands. Like any large feature this is a team effort, where over this past year we've [figured out ABI-compatibility](https://github.com/rust-lang/rust/pull/144529) and most recently [added const evaluation support](https://github.com/rust-lang/rust/pull/150601). I'm currently working on updating the [reference](https://github.com/rust-lang/reference/pull/2177), and plan to open a stabilization PR soon.

## Conclusion

When you do cursed things, problems find you.

The interplay between low-level systems work and compiler development has been very fruitful for us. It has been enormously gratifying to be able to tackle some of these problems ourselves, and we have lots of exciting things lined up for 2026.

*These contributions to the compiler resulted from Trifecta Tech Foundation's [Data compression initiative](/initiatives/data-compression). Please [contact us](/support) if you are interested in financially supporting this work.*