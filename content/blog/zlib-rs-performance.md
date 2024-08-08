+++
title = "Current zlib-rs performance"
slug = "current-zlib-rs-performance"
template = "blog/current-zlib-rs-performance.html"
+++

Our [`zlib-rs`](https://github.com/memorysafety/zlib-rs) project implements a drop-in replacement for `libz.so`, a dynamic library that is widely used to perform gzip (de)compression.

Of course `zlib-rs` is written in rust, and while we aim for a safe implementation, a crucial aspect for making this project succesful is solid performance. The original zlib implementation does not make good use of modern hardware, and the bar for zlib performance is set by the [`zlib-ng`](https://github.com/zlib-ng/zlib-ng) fork of zlib. It drops some legacy support, and makes good use of modern CPU capabilities like SIMD instructions.

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

The zlib-rs implementation relies heavily on instructions that are specific to your CPU. To make make use of these instructions, and let the compiler optimize with the assumption that the instructions will exist, it is important to pass the `target-cpu=native` flag. The most convenient way of specifying this flag is in a `.cargo/config.toml` file like so:

```toml
[build]
rustflags = ["-Ctarget-cpu=native"]
```

We will use`silezia-small.tar` as our input data. This file is commonly used to benchmark compression algorithms. At 15mb, it is neither trivially small nor overly large.

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

Let's compare the `ng` and `rs` implementations at three compresssion levels: 1, 6 and 9. Level 1 is the lowest level that does any work, level 6 is the default, and level 9 is the highest compression level. Intuitively, a higher compression level will try harder to compress your data, using more compute and generally taking longer.

**level 1**
```
Benchmark 1 (47 runs): ./target/release/examples/blogpost-compress 1 ng silesia-small.tar
  measurement          mean ± σ            min … max           outliers         delta
  wall_time           107ms ± 1.71ms     105ms …  115ms          1 ( 2%)        0%
  peak_rss           26.6MB ± 80.9KB    26.5MB … 26.8MB          0 ( 0%)        0%
  cpu_cycles          381M  ± 4.18M      375M  …  392M           0 ( 0%)        0%
  instructions        642M  ± 1.11K      642M  …  642M           2 ( 4%)        0%
  cache_references   7.49M  ± 1.28M     5.44M  … 9.98M           0 ( 0%)        0%
  cache_misses        335K  ± 9.95K      325K  …  395K           4 ( 9%)        0%
  branch_misses      3.35M  ± 8.28K     3.33M  … 3.37M           6 (13%)        0%
Benchmark 2 (47 runs): ./target/release/examples/blogpost-compress 1 rs silesia-small.tar
  measurement          mean ± σ            min … max           outliers         delta
  wall_time           106ms ± 1.64ms     104ms …  113ms          1 ( 2%)          -  0.3% ±  0.6%
  peak_rss           26.6MB ± 84.7KB    26.5MB … 26.8MB          0 ( 0%)          -  0.0% ±  0.1%
  cpu_cycles          380M  ± 4.73M      374M  …  394M           1 ( 2%)          -  0.2% ±  0.5%
  instructions        642M  ± 1.03K      642M  …  642M           2 ( 4%)          -  0.0% ±  0.0%
  cache_references   7.49M  ± 1.43M     5.40M  … 11.3M           2 ( 4%)          +  0.0% ±  7.4%
  cache_misses        334K  ± 10.7K      324K  …  398K           2 ( 4%)          -  0.4% ±  1.3%
  branch_misses      3.35M  ± 8.94K     3.34M  … 3.37M           1 ( 2%)          +  0.0% ±  0.1%
```
**level 6**

```
Benchmark 1 (16 runs): ./target/release/examples/blogpost-compress 6 ng silesia-small.tar
  measurement          mean ± σ            min … max           outliers         delta
  wall_time           319ms ± 4.66ms     313ms …  333ms          1 ( 6%)        0%
  peak_rss           24.4MB ± 95.3KB    24.3MB … 24.6MB          0 ( 0%)        0%
  cpu_cycles         1.22G  ± 10.9M     1.20G  … 1.24G           0 ( 0%)        0%
  instructions       2.10G  ±  490      2.10G  … 2.10G           0 ( 0%)        0%
  cache_references   22.6M  ± 4.65M     15.1M  … 29.4M           0 ( 0%)        0%
  cache_misses        351K  ± 25.3K      331K  …  419K           2 (13%)        0%
  branch_misses      9.49M  ± 24.9K     9.46M  … 9.53M           0 ( 0%)        0%
Benchmark 2 (16 runs): ./target/release/examples/blogpost-compress 6 rs silesia-small.tar
  measurement          mean ± σ            min … max           outliers         delta
  wall_time           322ms ± 6.51ms     312ms …  339ms          0 ( 0%)          +  1.0% ±  1.3%
  peak_rss           24.5MB ± 73.5KB    24.4MB … 24.6MB          0 ( 0%)          +  0.1% ±  0.3%
  cpu_cycles         1.24G  ± 20.4M     1.20G  … 1.28G           0 ( 0%)          +  1.1% ±  1.0%
  instructions       2.10G  ±  487      2.10G  … 2.10G           0 ( 0%)          -  0.0% ±  0.0%
  cache_references   25.9M  ± 4.83M     17.1M  … 34.4M           0 ( 0%)          + 14.9% ± 15.2%
  cache_misses        352K  ± 27.9K      332K  …  423K           3 (19%)          +  0.4% ±  5.5%
  branch_misses      9.48M  ± 21.1K     9.46M  … 9.53M           3 (19%)          -  0.0% ±  0.2%
```
**level 9**

```
Benchmark 1 (9 runs): ./target/release/examples/blogpost-compress 9 ng silesia-small.tar
  measurement          mean ± σ            min … max           outliers         delta
  wall_time           574ms ± 20.6ms     558ms …  616ms          0 ( 0%)        0%
  peak_rss           24.4MB ± 79.2KB    24.4MB … 24.6MB          0 ( 0%)        0%
  cpu_cycles         2.23G  ± 59.1M     2.18G  … 2.36G           0 ( 0%)        0%
  instructions       3.33G  ±  400      3.33G  … 3.33G           0 ( 0%)        0%
  cache_references   27.2M  ± 16.6M     13.3M  … 62.9M           0 ( 0%)        0%
  cache_misses        340K  ± 21.5K      290K  …  371K           2 (22%)        0%
  branch_misses      21.5M  ± 16.7K     21.4M  … 21.5M           0 ( 0%)        0%
Benchmark 2 (9 runs): ./target/release/examples/blogpost-compress 9 rs silesia-small.tar
  measurement          mean ± σ            min … max           outliers         delta
  wall_time           567ms ± 15.3ms     555ms …  606ms          1 (11%)          -  1.2% ±  3.2%
  peak_rss           24.4MB ± 68.1KB    24.3MB … 24.5MB          0 ( 0%)          -  0.0% ±  0.3%
  cpu_cycles         2.21G  ± 50.6M     2.17G  … 2.34G           1 (11%)          -  0.7% ±  2.5%
  instructions       3.33G  ±  696      3.33G  … 3.33G           0 ( 0%)          +  0.0% ±  0.0%
  cache_references   21.2M  ± 6.72M     13.5M  … 32.6M           0 ( 0%)          - 22.3% ± 46.6%
  cache_misses        353K  ± 21.2K      335K  …  401K           0 ( 0%)          +  3.7% ±  6.3%
  branch_misses      21.5M  ± 29.9K     21.5M  … 21.6M           1 (11%)          +  0.1% ±  0.1%
```

That's a lot of numbers. The main takeaway is that `poop` reports no significant differences between `zlib-ng` and `zlib-rs`, meaning that zlib-rs performance is on-par with zlib-ng.

Caveats apply: these results are on my specific x86_64 linux machine with AVX2 and with this specific input. We have not yet done extensive testing on other machines and other architectures.

## Conclusion

From the start of the zlib-rs project, we've been very mindful of performance. The architecture of the library is already geared towards performance (e.g. by doing all allocations up-front), and the zlib-ng implementation has SIMD implementation of bottlenecks that we were able to adopt. 

Still, it is encouraging that this effort has paid of, and that we are effectively on-par with zlib-ng. There is still more work to do though: zlib-ng has made some recent further improvements, we suspect better data layout could give us further gains, and there are more instruction sets to support.

--- 

### Support us

We need your financial backing to maintain our software and start new projects. Please get in touch with us via donate@trifectatech.org, if you are interested in financially supporting us. More: [trifectatech.org/support](https://trifectatech.org/support/)