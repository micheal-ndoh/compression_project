# Compression Project

A project implementing RLE (Run-Length Encoding) and LZ77 compression algorithms in both Rust and JavaScript.

## Features

- RLE (Run-Length Encoding) compression
- LZ77 compression
- Cross-language implementations (Rust and JavaScript)
- Configurable compression options
- Performance statistics
- Error handling
- File I/O support

## References

- [RLE](https://hydrolix.io/blog/run-length-encoding/)
- [LZ77](https://medium.com/@vincentcorbee/lz77-compression-in-javascript-cd2583d2a8bd)

## JavaScript Implementation

### Installation

```bash
cd js-compressor
npm install
```

### Usage

```javascript
const { compressFile, decompressFile } = require('./index');

// Basic compression
async function example() {
    try {
        // Compress a file using RLE
        const rleStats = await compressFile('input.txt', 'output.rle', 'rle');
        console.log('RLE Compression Stats:', rleStats);

        // Compress a file using LZ77 with custom window size
        const lz77Stats = await compressFile('input.txt', 'output.lz77', 'lz77', {
            windowSize: 2048
        });
        console.log('LZ77 Compression Stats:', lz77Stats);

        // Decompress files
        const decompressStats = await decompressFile('output.rle', 'decompressed.txt', 'rle');
        console.log('Decompression Stats:', decompressStats);
    } catch (error) {
        console.error('Error:', error.message);
    }
}
```

### API Documentation

#### compressFile(inputPath, outputPath, algorithm, options)
- `inputPath`: Path to input file
- `outputPath`: Path to output file
- `algorithm`: 'rle' or 'lz77'
- `options`: Algorithm-specific options (for LZ77: { windowSize: number })
- Returns: Promise with compression statistics

#### decompressFile(inputPath, outputPath, algorithm)
- `inputPath`: Path to compressed file
- `outputPath`: Path to output file
- `algorithm`: 'rle' or 'lz77'
- Returns: Promise with decompression statistics

## Rust Implementation

### Installation

```bash
cd rust-compressor
cargo build --release
```

### Usage

```bash
# Compress a file using RLE
cargo run -- compress input.txt output.rle --algorithm rle

# Compress a file using LZ77
cargo run -- compress input.txt output.lz77 --algorithm lz77

# Decompress a file
cargo run -- decompress output.rle decompressed.txt --algorithm rle
```

### Command Line Options

```
USAGE:
    rust-compressor <COMMAND>

COMMANDS:
    compress     Compress a file
    decompress   Decompress a file

OPTIONS:
    --algorithm <ALGORITHM>    Compression algorithm to use [default: rle]
                              [possible values: rle, lz77]
```

### API Documentation

The Rust implementation provides both a command-line interface and a library API:

```rust
use rust_compressor::{compress_rle, decompress_rle, compress_lz77, decompress_lz77};

// Compress data using RLE
let data = b"AAAABBBCCDAA";
let compressed = compress_rle(data);
let decompressed = decompress_rle(&compressed);

// Compress data using LZ77
let compressed = compress_lz77(data);
let decompressed = decompress_lz77(&compressed);
```

## Performance Comparison

Both implementations provide performance statistics:

### JavaScript Output Example
```javascript
{
    originalSize: 1000,
    compressedSize: 500,
    compressionRatio: "0.50",
    compressionTime: "0.123",
    algorithm: "lz77",
    options: { windowSize: 2048 }
}
```

### Rust Output Example
```rust
File compressed successfully using lz77 algorithm
Original size: 1000 bytes
Compressed size: 500 bytes
Compression ratio: 0.50
```

## Error Handling

Both implementations include comprehensive error handling:

- Invalid input data
- File I/O errors
- Invalid compression formats
- Algorithm-specific errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.