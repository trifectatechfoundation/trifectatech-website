+++
title = "Improving state machine code generation"
slug = "improving-state-machine-code-generation"
authors = ["Folkert de Vries"]
date = "2025-09-09"

[taxonomies]
tags = ["state machines", "codegen"] 

+++

Over the past couple of months, Björn and I have been working on [improving state machine code generation]( https://github.com/rust-lang/rust-project-goals/issues/258) in the rust compiler, a rust project goal for 2025H1. In late June, [PR 138780](https://github.com/rust-lang/rust/pull/138780) was merged, which adds `#![feature(loop_match)]`.

<!-- more -->

This post shows what `loop_match` is and why we're extremely excited about it.

## Motivation

We first ran into rust's sup-par code generation for state machines when we were porting [zlib-rs](https://github.com/trifectatechfoundation/zlib-rs) from C to rust. When looking at state machines written in C, it is quite common to see a `switch` with cases where one will implicitly fall through into the next.

```c
switch (a) {
    case 1:
        // do work
        a += 1;
        /* implicit fallthrough */
    case 2:
        // do more work
        a += 1;
        /* implicit fallthrough */
    case 3:
        break;
    default:
}
```

When `a` is `1`, the code for the `case 1` branch is executed, but then C will automatically continue executing the code for `case 2`: the default behavior is to fall through into the next branch. The `break` keyword can be used to prevent this implicit fallthrough.

This behavior is so subtle that when it is used deliberately, it is often explicitly documented in mature C code bases. Coming from Rust (and Haskell before that) I never really understood why C had this fallthrough behavior. And even if maybe there was a good reason for falling through, surely it should not be the default (e.g. `continue` could be used to signify fallthrough and the default could be to `break`).

But now, having read more C state machine code, my theory is that a lot of early C was basically building state machines. The fallthrough is an unconditional jump to the next switch branch, and hence very efficient. If anyone actually knows the original motivation, please reach out!

In any case, rust does not (and should not) have implicit fallthrough from one case into another. Instead, we'd normally write state machines like so:

```rust
enum State { A, B, C }

fn run(mut state: State) {
    loop {
        match state {
            State::A => {
                // do work
                state = State::B;
            }
            State::B => {
                // do more work
                state = State::C;
            }
            State::C => break,
        }
    }
}
```

To jump from the `A` branch to the `B` branch, we update the `state` variable, jump back to the top of the loop, and then match on `state` to reach the `B` branch. The observable behavior is the  same as with implicit fallthroughs, but in terms of compiler optimizations, this rust code is much worse.

To move from one state to another, we must first update the state, then jump back to the top of the loop (an unconditional jump) and then branch on the state (an unconditional jump).

On older CPUs this pattern destroys the branch predictor, because the branch on the state is hard to predict. Modern CPUs are a lot more capable though, and the branch predictor seems to be able to handle this OK these days.

Rather, the issue we've found  is that the indirection of jumping to the top and then branching introduces additional code paths that are never used in practice. We can see that once we reach state `B` we will never go back to state `A`, but on an assembly level that code path is present. For small examples the compiler can figure this out, but for real-world state machines the additional code paths appear to inhibit other optimizations.

## Our solution: `#[loop_match]`

So, what should jumping directly from one match branch to another look like in rust? Inspired by [labeled switch](https://ziglang.org/devlog/2024/#2024-09-11) in zig, our [RFC](https://github.com/rust-lang/rfcs/pull/3720) initially proposed new syntax, but we eventually settled on attributes as a lower-friction approach that allowed us to experiment with the actual implementation.

> **Aside**: my lesson from writing that RFC is to just never propose syntax. The problem with language syntax is that everyone can (indeed, will) have an opinion on it. Only a few people meaningfully contribute to the actual feature design.

Hence, `#[loop_match]`:

```rust
enum State { A, B, C }

fn run(mut state: State) {
    #[loop_match]
    loop {
        state = 'blk {
            match state {
                State::A => {
                    // do work
                    #[const_continue]
                    break 'blk State::B; // direct jump to the B branch
                }
                State::B => {
                    // do more work
                    #[const_continue]
                    break 'blk State::C; // direct jump to the C branch
                }
                State::C => break,
            }
        }
    }
}
```

The `#[loop_match]` annotation is applied to the `loop`. The body of that loop must be an assignment to the state variable, where the right-hand side of the assignment is a labeled block containing a match on the state variable.

To jump from one state to another, `#[const_continue]` can be used on a `break` from the labeled block with the updated state value. The value that is given to the break **must** be a constant. In the compiler we perform compile-time pattern matching on this value to determine which branch of the `match` it will end up in, and insert a direct jump to that branch.

The syntax is certainly not the prettiest, but:

- we emit better code that uses direct jumps and does not introducing unused code paths.
- when  `#[loop_match]` and `#[const_continue]` are configured out (e.g. with `#[cfg_attr(feature = "loop_match", loop_match)]`), the code behaves like before.
## Benchmarks

So, how much does this help? As always, it depends.

Your algorithm must actually look like a `loop`  with a `match`  to benefit at all. Even then the performance gain depends on for instance how many states there are, and how often you switch between states. Let's look at two practical examples.

### An email address parser

We benchmarked this [generated email address parser](https://github.com/folkertdev/email-parser-benchmark) with 133 states. This code is a perfect fit for `#[loop_match]`. The results are impressive:

```
Benchmark 1 (8 runs): ./target/release/nightly
  measurement          mean ± σ         delta
  wall_time           706ms ± 3.20ms    0%
  peak_rss           1.98MB ± 84.0KB    0%
  cpu_cycles         3.12G  ± 14.1M     0%
  instructions       9.44G  ±  173      0%
  cache_references    131K  ± 90.0K     0%
  cache_misses       19.8K  ± 21.6K     0%
  branch_misses      49.1K  ± 40.8K     0%
Benchmark 2 (11 runs): ./target/release/enable-dfa-jump-thread
  measurement          mean ± σ         delta
  wall_time           476ms ± 1.54ms    🚀- 32.6% ±  0.3%
  peak_rss           2.03MB ± 68.5KB      +  2.2% ±  3.7%
  cpu_cycles         2.11G  ± 3.40M     🚀- 32.3% ±  0.3%
  instructions       5.90G  ±  267      🚀- 37.6% ±  0.0%
  cache_references   50.8K  ± 13.4K     🚀- 61.1% ± 44.1%
  cache_misses       8.57K  ±  956        - 56.7% ± 68.7%
  branch_misses       226K  ± 34.4K     💩+361.2% ± 74.2%
Benchmark 3 (18 runs): ./target/release/loop-match
  measurement          mean ± σ         delta
  wall_time           286ms ± 2.80ms    🚀- 59.4% ±  0.4%
  peak_rss           2.06MB ± 60.4KB      +  3.9% ±  3.0%
  cpu_cycles         1.26G  ± 11.6M     🚀- 59.6% ±  0.3%
  instructions       5.29G  ±  227      🚀- 44.0% ±  0.0%
  cache_references   50.6K  ± 27.1K     🚀- 61.2% ± 36.1%
  cache_misses       9.04K  ± 3.07K     🚀- 54.3% ± 52.9%
  branch_misses       920K  ±  103K     💩+1772.7% ± 159.6%
```

Here we benchmark three binaries:

- `nightly` is a baseline that uses the nightly compiler, but no unstable features.
- `enable-dfa-jump-thread` uses the `-Cllvm-args=-enable-dfa-jump-thread` flag to optimize state machines.
- `loop-match` enables and uses `#![loop_match]`.

We see that `loop-match` is by far the fastest. You can reproduce this benchmark by cloning the repository linked above and running `./run.sh` .

Why is `loop_match` faster than the LLVM flag? We believe that the underlying reason is that the LLVM flag runs on the whole program, which has some downsides versus our per-loop approach:

- The analysis is more computationally expensive, because it must go over the whole program. This is why the analysis is not enabled by default.
- The analysis must be more conservative, or it might make the final program slower.
- This analysis runs at the very end of the compilation pipeline, which means that earlier passes can't use its results.

The large increase in `branch_misses` for both optimized programs appears to be highly CPU-specific. On other machines (where the speedup is actually larger) we don't observe such a large increase. We do have some ideas for more optimal code generation, even when the state is updated with a value that is not compile-time known, which may help here.

### Decompression in `zlib-rs`

For `zlib-rs`, the state machine optimizations matter mostly when input arrives in (very) small chunks. For larger amounts of input the implementation falls down into a heavily optimized loop, and the state machine logic isn't used that much.

Here we take the most extreme case, where input arrives in chunks of 16 bytes. Admittedly that somewhat exaggerates the results, but on the other hand, anything that makes a library like zlib faster is a significant achievement.

```
Benchmark 1 (65 runs): target/release/examples/uncompress-baseline rs-chunked 4
  measurement          mean ± σ         delta
  wall_time          77.7ms ± 3.04ms    0%
  peak_rss           24.1MB ± 64.6KB    0%
  cpu_cycles          303M  ± 11.8M     0%
  instructions        833M  ±  266      0%
  cache_references   3.62M  ±  310K     0%
  cache_misses        209K  ± 34.2K     0%
  branch_misses      4.09M  ± 10.0K     0%
Benchmark 2 (68 runs): target/release/examples/uncompress-llvm-dfa rs-chunked 4
  measurement          mean ± σ         delta
  wall_time          74.0ms ± 3.24ms    🚀-  4.8% ±  1.4%
  peak_rss           24.1MB ± 27.1KB      -  0.1% ±  0.1%
  cpu_cycles          287M  ± 12.7M     🚀-  5.4% ±  1.4%
  instructions        797M  ±  235      🚀-  4.3% ±  0.0%
  cache_references   3.56M  ±  439K       -  1.8% ±  3.6%
  cache_misses        144K  ± 32.5K     🚀- 31.2% ±  5.4%
  branch_misses      4.09M  ± 9.62K       -  0.1% ±  0.1%
Benchmark 3 (70 runs): target/release/examples/uncompress-loop-match rs-chunked 4
  measurement          mean ± σ         delta
  wall_time          71.6ms ± 2.43ms    🚀-  7.8% ±  1.2%
  peak_rss           24.1MB ± 72.8KB      -  0.0% ±  0.1%
  cpu_cycles          278M  ± 9.59M     🚀-  8.5% ±  1.2%
  instructions        779M  ±  277      🚀-  6.6% ±  0.0%
  cache_references   3.49M  ±  270K     🚀-  3.8% ±  2.7%
  cache_misses        142K  ± 25.6K     🚀- 32.0% ±  4.8%
  branch_misses      4.09M  ± 7.83K       +  0.0% ±  0.1%
```

Interestingly, in this case combining `#[loop_match]` and  `-enable-dfa-jump-thread` is actually slightly slower than using just `#[loop_match]`. So far we've never seen any significant benefit to combining the two flags.

```
Benchmark 4 (69 runs): target/release/examples/uncompress-llvm-dfa-loop-match rs-chunked 4
  measurement          mean ± σ         delta
  wall_time          72.8ms ± 2.57ms    🚀-  6.3% ±  1.2%
  peak_rss           24.1MB ± 35.1KB      -  0.1% ±  0.1%
  cpu_cycles          281M  ± 10.1M     🚀-  7.5% ±  1.2%
  instructions        778M  ±  243      🚀-  6.7% ±  0.0%
  cache_references   3.45M  ±  277K     🚀-  4.7% ±  2.7%
  cache_misses        176K  ± 43.4K     🚀- 15.8% ±  6.3%
  branch_misses      4.16M  ± 96.0K     💩+  1.7% ±  0.6%
```

Reproduce this with:

```sh
git clone git@github.com:trifectatechfoundation/zlib-rs.git
cd zlib-rs
git checkout 012cc2a7fa7dfde450f74df12a333c465d877e1c
sh loop-match.sh
```

## Next steps

The `loop_match` feature is still experimental. Since the initial PR was merged, fuzzing has found some issues that we're working through.  Issues and PRs related to `#[loop_match]` get the [`F-loop_match`](https://github.com/rust-lang/rust/labels/F-loop_match) label.

The type of `state` is currently restricted to basic types: we support integers, floats, `bool`, `char` and enum types that are represented as an integer value. Adding support for more types is complex and requires more substantial changes to the compiler (e.g. a refactoring of how nested or-patterns are handled).

And finally, we have to show that this attribute actually pulls its weight. Therefore, if you have a project that looks like it would benefit from this feature, please let us know and/or give `#[loop_match]` a try and report how it went.

### Future work and thank yous

Our goal for `loop-match` and other performance work is to unblock the use of Rust for performance-critical applications, in support of Trifecta Tech Foundation's mission to make critical infrastructure software safer. 

We thank [Tweede golf](https://tweedegolf.nl/en) for getting this project started and [NLnet Foundation](https://nlnet.nl) and [AWS](https://aws.amazon.com/) for their continued support by funding [milestones 1 and 2](https://trifectatech.org/initiatives/workplans/codegen/), respectively. The work on these milestones continues, notably: improving the `loop-match` mechanism and adding experimental support to c2rust.
