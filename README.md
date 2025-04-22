# File Compression CLI

A command-line tool that implements and compares different compression algorithms in JavaScript and Rust.

## Supported Algorithms

- RLE (Run-Length Encoding): Best for files with lots of repeated characters
- LZ77 (Lempel-Ziv 77): Better for general-purpose compression

## Prerequisites

- Docker
- Node.js (for WASM and local usage)
- Rust (for local usage)

## Usage Instructions

### 1. Using JavaScript Implementation

#### Compression

```bash
# RLE Compression
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/js-compressor:latest compress "/data/input.txt" "/data/output.compressed" --algorithm rle
```

```bash
# LZ77 Compression
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/js-compressor:latest compress "/data/input.txt" "/data/output.compressed" --algorithm lz77
```

```bash
# Auto-detect algorithm based on file type
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/js-compressor:latest compress "/data/input.txt" "/data/output.compressed" --algorithm auto
```

#### Decompression

```bash
# RLE Decompression
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/js-compressor:latest decompress "/data/input.compressed" "/data/output.txt" --algorithm rle
```

```bash
# LZ77 Decompression
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/js-compressor:latest decompress "/data/input.compressed" "/data/output.txt" --algorithm lz77
```

### 2. Using Rust Implementation

#### Compression

```bash
# RLE Compression
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/rust-compressor:latest compress "/data/input.txt" "/data/output.compressed" --algorithm rle
```

```bash
# LZ77 Compression
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/rust-compressor:latest compress "/data/input.txt" "/data/output.compressed" --algorithm lz77
```

```bash
# Auto-detect algorithm
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/rust-compressor:latest compress "/data/input.txt" "/data/output.compressed" --algorithm auto
```

#### Decompression

```bash
# RLE Decompression
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/rust-compressor:latest decompress "/data/input.compressed" "/data/output.txt" --algorithm rle
```

```bash
# LZ77 Decompression
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/rust-compressor:latest decompress "/data/input.compressed" "/data/output.txt" --algorithm lz77
```

### 3. Benchmark Tool

To compare all implementations and algorithms at once:

```bash
./benchmark.sh input.txt
```

This will:

- Test both RLE and LZ77 algorithms
- Compare JavaScript and Rust implementations
- Generate a report with:
  - Compression ratios
  - Compression/decompression speeds
  - File size comparisons
  - Verification results

## Advanced Features

### 1. Stdin/Stdout Streaming

Both implementations support reading from stdin and writing to stdout using `-` as the file path:

```bash
# JavaScript Implementation
# Compress from stdin to stdout
echo "Hello World" | docker run --rm -i ghcr.io/micheal-ndoh/js-compressor:latest compress - - --algorithm rle > output.compressed
```

```bash
# Decompress from stdin to stdout
cat output.compressed | docker run --rm -i ghcr.io/micheal-ndoh/js-compressor:latest decompress - - --algorithm rle > output.txt
```

```bash
# Rust Implementation
# Compress from stdin to stdout
echo "Hello World" | docker run --rm -i ghcr.io/micheal-ndoh/rust-compressor:latest compress - - --algorithm rle > output.compressed
```

```bash
# Decompress from stdin to stdout
cat output.compressed | docker run --rm -i ghcr.io/micheal-ndoh/rust-compressor:latest decompress - - --algorithm rle > output.txt
```

### 2. Automatic Algorithm Selection

Both implementations can automatically choose the best compression algorithm based on file content:

```bash
# JavaScript Implementation
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/js-compressor:latest compress "/data/input.txt" "/data/output.compressed" --algorithm auto

# Rust Implementation
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/rust-compressor:latest compress "/data/input.txt" "/data/output.compressed" --algorithm auto
```

### 3. WebAssembly (WASM) Support

Use the Rust implementation directly in JavaScript through WebAssembly:

```javascript
// In your JavaScript code
import init, { compress_rle, decompress_rle, compress_lz77, decompress_lz77 } from '@micheal-ndoh/rust-compressor-wasm';

async function example() {
    // Initialize WASM module
    await init();

    // Compress using RLE
    const input = new TextEncoder().encode('Hello World');
    const compressed = compress_rle(input);
    
    // Decompress
    const decompressed = decompress_rle(compressed);
    console.log(new TextDecoder().decode(decompressed));
}
```

### 4. Multiple File Compression

Compress multiple files in a single command using glob patterns:

```bash
# JavaScript Implementation
# Compress all text files in current directory
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/js-compressor:latest compress "/data/*.txt" "/data/output/" --algorithm auto

# Rust Implementation
# Compress all text files in current directory
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/rust-compressor:latest compress "/data/*.txt" "/data/output/" --algorithm auto

# Decompress multiple files
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/js-compressor:latest decompress "/data/output/*.compressed" "/data/restored/" --algorithm auto
```

## Command Format

```bash
docker run --rm -v "$(pwd):/data" [IMAGE] [COMMAND] [INPUT] [OUTPUT] --algorithm [ALGORITHM]

Where:
- IMAGE: ghcr.io/micheal-ndoh/js-compressor:latest or ghcr.io/micheal-ndoh/rust-compressor:latest
- COMMAND: compress or decompress
- INPUT: path to input file/pattern (prefix with /data/) or - for stdin
- OUTPUT: path to output file/directory (prefix with /data/) or - for stdout
- ALGORITHM: rle, lz77, or auto
```

## Examples

1. Compress a text file using JavaScript RLE:

```bash
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/js-compressor:latest compress "/data/myfile.txt" "/data/myfile.compressed" --algorithm rle
```

2. Decompress using Rust LZ77:

```bash
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/rust-compressor:latest decompress "/data/myfile.compressed" "/data/myfile.restored" --algorithm lz77
```

3. Run benchmark on a specific file:

```bash
./benchmark.sh myfile.txt
```

4. Compress multiple files with auto-detection:

```bash
docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/js-compressor:latest compress "/data/files/*.txt" "/data/compressed/" --algorithm auto
```

5. Stream compression through pipes:

```bash
cat myfile.txt | docker run --rm -i ghcr.io/micheal-ndoh/rust-compressor:latest compress - - --algorithm rle > compressed.bin
```
