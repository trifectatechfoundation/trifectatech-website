+++
title = "Current zlib-rs performance"
slug = "current-zlib-rs-performance"
authors = ["Folkert de Vries"]
date = "2024-08-08"

[taxonomies]
tags = ["zlib-rs", "data compression"] 

[extra]
source = "Trifecta Tech Foundation"
+++

Our [`zlib-rs`](https://github.com/memorysafety/zlib-rs) project implements a drop-in replacement for `libz.so`, a dynamic library that is widely used to perform gzip (de)compression.

<!-- more -->

Of course, `zlib-rs` is written in rust, and while we aim for a safe implementation, a crucial aspect of making this project successful is solid performance. The original zlib implementation does not make good use of modern hardware, and the bar for zlib performance is set by the [`zlib-ng`](https://github.com/zlib-ng/zlib-ng) fork of zlib. It drops some legacy support, and makes good use of modern CPU capabilities like SIMD instructions. It is not uncommon for zlib-ng to be 2X faster than stock zlib.

In order to be an attractive alternative to zlib, and make some system administrator go through the process of using our implementation, we must at least be close in performance to zlib-ng. In this post we'll see how the implementation performs today, and how we actually (try to) measure that performance.

## setup

In my experience, it is easiest to write a benchmark as a separate program. It is simpler to guarantee that the program won't optimize in invalid ways (e.g. by looking at the input it will receive) and we can use external tools on this program to inspect it easily.

Here is the main function we'll be using ([full source code](https://gist.github.com/folkertdev/7e3634b93b0b2c074f05d54819753a56)).

```rust
fn main() {
    let mut it = std::env::args();

    // skips the program name
    let _ = it.next().unwrap();

    let level: i32 = it.next().unwrap().parse().unwrap();

    let mut dest_vec = vec![0u8; 1 << 28];
    let mut dest_len = dest_vec.len();

    match it.next().unwrap().as_str() {
        "ng" => {
            let path = it.next().unwrap();
            let input = std::fs::read(path).unwrap();

            let err = compress_ng(&mut dest_vec, &mut dest_len, &input, level);
            assert_eq!(ReturnCode::Ok, err);
        }
        "rs" => {
            let path = it.next().unwrap();
            let input = std::fs::read(path).unwrap();

            let err = compress_rs(&mut dest_vec, &mut dest_len, &input, level);
            assert_eq!(ReturnCode::Ok, err);
        }
        other => panic!("invalid input: {other:?}"),
    }
}
```

The `compress_ng` and `compress_rs` functions are equivalent, except that they import the implementation of their respective library. Both are linked in statically.

The zlib-rs implementation relies heavily on instructions that are specific to your CPU. To make use of these instructions, and let the compiler optimize with the assumption that the instructions will exist, it is important to pass the `target-cpu=native` flag. The most convenient way of specifying this flag is in a `.cargo/config.toml` file like so:

```toml
[build]
rustflags = ["-Ctarget-cpu=native"]
```

We will use `silezia-small.tar` as our input data. This file is commonly used to benchmark compression algorithms. At 15mb, it is neither trivially small nor overly large.

We can then build and run the benchmark, picking the compression level and the implementation that should be used: 

```
> cargo build --release --example blogpost-compress
> ./target/release/examples/blogpost-compress 9 ng silesia-small.tar
> ./target/release/examples/blogpost-compress 9 rs silesia-small.tar
```

## The benchmarking process

For the actual benchmarking, I use a tool called [`poop`](https://github.com/andrewrk/poop/tree/main), the "performance optimization observability platform" by Andrew Kelley, of zig fame. I prefer it over tools like `hyperfine` because it reports extra statistics about the program.

Like `hyperfine`, `poop` takes a series of commands, will run them in a loop for some amount of time, and then reports the average time per iteration for each command. Note that we're not using `cargo run`, but instead call the binary in our target directory directly. That is extremely important, `cargo run` adds significant overhead!

```sh
poop \
    "./target/release/examples/blogpost-compress 1 ng silesia-small.tar" \
    "./target/release/examples/blogpost-compress 1 rs silesia-small.tar"
```
For end users, the most important metric is wall time: this is what e.g. `hyperfine` would report. But `poop` reports extra statistics that are helpful during development. For instance, the instruction count (number of instructions executed in total) is correlated with wall time, but usually has less noise. A high number of branch or cache misses gives direction to the search for optimization opportunities.

```
measurement          mean ± σ        delta
wall_time           107ms ± 2.78ms   ⚡ -  9.9% ±  3.5%
peak_rss           26.6MB ± 84.2KB     -  0.1% ±  0.1%
cpu_cycles          382M  ± 8.60M    ⚡ -  7.5% ±  2.8%
instructions        642M  ± 1.59K      -  0.0% ±  0.0%
cache_references   7.62M  ± 1.24M    ⚡ -  8.3% ±  7.0%
cache_misses        334K  ± 13.2K      +  0.1% ±  1.3%
branch_misses      3.35M  ± 7.51K      -  0.2% ±  0.1%
```

Significant improvements are indicated by the lightning bolt emoji (and green colors in the terminal). I'll let you guess what emoji `poop` uses when performance gets worse. No emoji means no significant changes.

## Results

Let's compare the `ng` and `rs` implementations at three compresssion levels: 1, 6 and 9. Level 1 is the lowest level that does any work, level 6 is the default, and level 9 is the highest compression level. Intuitively, a higher compression level will try harder to compress your data: that takes more compute and will take longer.

**level 1**
```
Benchmark 1 (53 runs): ./target/release/examples/blogpost-compress 1 ng silesia-small.tar
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          94.6ms ± 1.87ms    92.1ms …  103ms          3 ( 6%)        0%
  peak_rss           26.7MB ± 83.2KB    26.6MB … 26.9MB          0 ( 0%)        0%
  cpu_cycles          332M  ± 4.63M      324M  …  347M           1 ( 2%)        0%
  instructions        468M  ±  452       468M  …  468M           0 ( 0%)        0%
  cache_references   6.72M  ± 1.72M     4.17M  … 10.7M           0 ( 0%)        0%
  cache_misses        343K  ± 16.3K      325K  …  448K           2 ( 4%)        0%
  branch_misses      3.34M  ± 12.0K     3.31M  … 3.36M           0 ( 0%)        0%
Benchmark 2 (44 runs): ./target/release/examples/blogpost-compress 1 rs silesia-small.tar
  measurement          mean ± σ            min … max           outliers         delta
  wall_time           114ms ± 8.79ms     106ms …  149ms          4 ( 9%)        💩+ 20.2% ±  2.6%
  peak_rss           26.7MB ± 80.5KB    26.6MB … 26.9MB          0 ( 0%)          -  0.0% ±  0.1%
  cpu_cycles          397M  ± 21.2M      376M  …  489M           4 ( 9%)        💩+ 19.5% ±  1.8%
  instructions        642M  ± 1.22K      642M  …  642M           2 ( 5%)        💩+ 37.1% ±  0.0%
  cache_references   7.76M  ± 1.66M     4.99M  … 12.2M           0 ( 0%)        💩+ 15.5% ± 10.2%
  cache_misses        461K  ±  209K      312K  … 1.08M           5 (11%)        💩+ 34.4% ± 16.7%
  branch_misses      3.32M  ± 16.9K     3.30M  … 3.36M           0 ( 0%)          -  0.5% ±  0.2%
```
**level 6**

```
Benchmark 1 (17 runs): ./target/release/examples/blogpost-compress 6 ng silesia-small.tar
  measurement          mean ± σ            min … max           outliers         delta
  wall_time           294ms ± 8.09ms     286ms …  320ms          1 ( 6%)        0%
  peak_rss           24.6MB ± 80.8KB    24.4MB … 24.7MB          0 ( 0%)        0%
  cpu_cycles         1.13G  ± 32.7M     1.09G  … 1.23G           1 ( 6%)        0%
  instructions       1.66G  ± 1.02K     1.66G  … 1.66G           1 ( 6%)        0%
  cache_references   24.2M  ± 9.59M     10.7M  … 54.0M           1 ( 6%)        0%
  cache_misses        352K  ± 29.6K      333K  …  463K           1 ( 6%)        0%
  branch_misses      9.24M  ± 7.59K     9.23M  … 9.26M           0 ( 0%)        0%
Benchmark 2 (17 runs): ./target/release/examples/blogpost-compress 6 rs silesia-small.tar
  measurement          mean ± σ            min … max           outliers         delta
  wall_time           311ms ± 6.39ms     303ms …  324ms          0 ( 0%)        💩+  5.7% ±  1.7%
  peak_rss           24.6MB ± 85.9KB    24.4MB … 24.7MB          0 ( 0%)          -  0.1% ±  0.2%
  cpu_cycles         1.19G  ± 24.7M     1.16G  … 1.25G           0 ( 0%)        💩+  5.9% ±  1.8%
  instructions       2.10G  ±  349      2.10G  … 2.10G           0 ( 0%)        💩+ 26.3% ±  0.0%
  cache_references   25.7M  ± 5.48M     19.3M  … 36.7M           0 ( 0%)          +  6.2% ± 22.6%
  cache_misses        323K  ± 19.0K      314K  …  386K           2 (12%)         ⚡-  8.1% ±  5.0%
  branch_misses      9.51M  ± 10.3K     9.50M  … 9.53M           0 ( 0%)        💩+  2.9% ±  0.1%
```
**level 9**

```
Benchmark 1 (9 runs): ./target/release/examples/blogpost-compress 9 ng silesia-small.tar
  measurement          mean ± σ            min … max           outliers         delta
  wall_time           553ms ± 14.2ms     541ms …  581ms          0 ( 0%)        0%
  peak_rss           24.6MB ± 80.3KB    24.5MB … 24.7MB          0 ( 0%)        0%
  cpu_cycles         2.15G  ± 46.2M     2.11G  … 2.23G           0 ( 0%)        0%
  instructions       2.83G  ± 1.65K     2.83G  … 2.83G           1 (11%)        0%
  cache_references   20.0M  ± 12.4M     7.92M  … 42.2M           0 ( 0%)        0%
  cache_misses        384K  ± 28.4K      358K  …  433K           0 ( 0%)        0%
  branch_misses      23.1M  ± 22.4K     23.1M  … 23.1M           0 ( 0%)        0%
Benchmark 2 (9 runs): ./target/release/examples/blogpost-compress 9 rs silesia-small.tar
  measurement          mean ± σ            min … max           outliers         delta
  wall_time           568ms ± 13.4ms     555ms …  597ms          0 ( 0%)          +  2.8% ±  2.5%
  peak_rss           24.6MB ± 95.4KB    24.4MB … 24.7MB          0 ( 0%)          +  0.0% ±  0.4%
  cpu_cycles         2.22G  ± 51.9M     2.17G  … 2.33G           0 ( 0%)          +  3.1% ±  2.3%
  instructions       3.33G  ±  571      3.33G  … 3.33G           0 ( 0%)        💩+ 17.6% ±  0.0%
  cache_references   25.3M  ± 13.0M     10.2M  … 52.9M           0 ( 0%)          + 26.6% ± 63.6%
  cache_misses        348K  ± 27.1K      329K  …  415K           1 (11%)         ⚡-  9.4% ±  7.2%
  branch_misses      21.4M  ± 21.7K     21.4M  … 21.4M           0 ( 0%)         ⚡-  7.3% ±  0.1%
```

That's a lot of numbers. For users, the most important number is the wall time, where contrary to intuition zlib-rs is on-par with zlib-ng for the highest compression level, but much worse for the lowest compression level. That just reflects where we've spent our time so far: a lot of time has gone into compression level 9 where we already do well, almost none has gone into level 1 where we currently do comparatively poorly.

Note that the `instructions` number is structurally much higher for rust code, even when that is not reflected in the wall time. Most of this increase is bounds checks: these are comparisons branches that are always predicted correctly, so they have little runtime cost, but do count towards the number of executed instructions.

For completeness, here is a benchmark of decompression speed

```
Benchmark 1 (128 runs): ./target/release/examples/blogpost-uncompress ng silesia-small.tar.gz
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          38.9ms ±  949us    37.7ms … 44.9ms          4 ( 3%)        0%
  peak_rss           24.3MB ± 77.7KB    24.1MB … 24.5MB          0 ( 0%)        0%
  cpu_cycles          119M  ± 1.59M      118M  …  129M          10 ( 8%)        0%
  instructions        219M  ± 1.18K      219M  …  219M           7 ( 5%)        0%
  cache_references   1.12M  ± 20.6K     1.07M  … 1.24M           5 ( 4%)        0%
  cache_misses        394K  ± 32.7K      349K  …  477K           0 ( 0%)        0%
  branch_misses       984K  ± 1.83K      981K  …  995K           6 ( 5%)        0%
Benchmark 2 (123 runs): ./target/release/examples/blogpost-uncompress rs silesia-small.tar.gz
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          40.7ms ±  935us    39.7ms … 45.2ms          1 ( 1%)        💩+  4.8% ±  0.6%
  peak_rss           24.3MB ± 77.8KB    24.2MB … 24.5MB          0 ( 0%)          +  0.1% ±  0.1%
  cpu_cycles          127M  ± 2.18M      126M  …  140M          24 (20%)        💩+  6.5% ±  0.4%
  instructions        345M  ± 1.29K      345M  …  345M           7 ( 6%)        💩+ 57.6% ±  0.0%
  cache_references   1.57M  ± 17.0K     1.54M  … 1.67M           1 ( 1%)        💩+ 40.5% ±  0.4%
  cache_misses        574K  ± 52.2K      513K  …  640K           0 ( 0%)        💩+ 45.7% ±  2.7%
  branch_misses       988K  ± 1.19K      986K  …  991K           0 ( 0%)          +  0.4% ±  0.0%
```

Being within ~5% of a highly optimized implementation is a good start, but clearly there is work left to be done.

Caveats apply: these results are on my specific x86_64 linux machine with AVX2 and with this specific input. We have not yet done extensive testing on other machines and other architectures.

## Conclusion

From the start of the zlib-rs project, we've been very mindful of performance. The architecture of the library is already geared towards performance (e.g. by doing all allocations up-front), and the zlib-ng implementation has SIMD implementation of algorithmic bottlenecks that we were able to adopt. 

Still, it is encouraging that this effort has paid of, and that we are extremely close to matching the performance of zlib-ng. There is still more work to do though: zlib-ng has made some recent further improvements, we suspect better data layout could give us further gains, and there are more instruction sets to support.

--- 

### Support us

We need your financial backing to maintain our software and start new projects. Please [get in touch with us](/support), if you are interested in financially supporting us.
