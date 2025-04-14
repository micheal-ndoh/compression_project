use criterion::{black_box, criterion_group, criterion_main, Criterion};
use rust_compressor::{compress_lz77, compress_rle, decompress_lz77, decompress_rle};

fn rle_benchmark(c: &mut Criterion) {
    let data = vec![b'a'; 1000];
    c.bench_function("rle_compress", |b| {
        b.iter(|| compress_rle(black_box(&data)))
    });

    let compressed = compress_rle(&data);
    c.bench_function("rle_decompress", |b| {
        b.iter(|| decompress_rle(black_box(&compressed)))
    });
}

fn lz77_benchmark(c: &mut Criterion) {
    let data = vec![b'a'; 1000];
    c.bench_function("lz77_compress", |b| {
        b.iter(|| compress_lz77(black_box(&data)))
    });

    let compressed = compress_lz77(&data);
    c.bench_function("lz77_decompress", |b| {
        b.iter(|| decompress_lz77(black_box(&compressed)))
    });
}

criterion_group!(benches, rle_benchmark, lz77_benchmark);
criterion_main!(benches);
