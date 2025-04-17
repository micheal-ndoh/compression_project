# Compression Project

This project implements RLE (Run-Length Encoding) and LZ77 compression algorithms in both Rust and JavaScript. It provides both containerized and local installation options, with support for stdin/stdout, file type detection, WASM compilation, and multiple file processing.

## Table of Contents

- [Docker Installation](#docker-installation)
- [Local Installation](#local-installation)
- [Usage](#usage)
  - [JavaScript Compressor](#javascript-compressor)
  - [Rust Compressor](#rust-compressor)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## Docker Installation

### Pull the Docker Image either the rust compressor or the java script(js) compressor

```bash
docker pull ghcr.io/micheal-ndoh/rust-compressor:latest

```

```bash
docker pull ghcr.io/micheal-ndoh/js-compressor:latest
```

### Run the Container

```bash
# Run JavaScript version
docker run -v $(pwd):/data your-registry/compression-project:latest js-compress

# Run Rust version
docker run -v $(pwd):/data your-registry/compression-project:latest rust-compress
```

### Build the Docker Image Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/compression-project.git
cd compression-project

# Build the image
docker build -t compression-project .
```

## Local Installation

### Prerequisites

- Node.js (v14 or higher)
- Rust (latest stable)
- Cargo
- wasm-pack (for WASM compilation)

### JavaScript Compressor Installation

```bash
# Navigate to JavaScript project
cd js-compressor

# Install dependencies
npm install
```

### Rust Compressor Installation

```bash
# Navigate to Rust project
cd rust-compressor

# Build the project
cargo build --release

# Build WASM
wasm-pack build --target web
```

## Features

### 1. Stdin/Stdout Support

Both implementations support reading from stdin and writing to stdout using the `-` character:

```bash
# Compress from stdin to stdout
cat input.txt | node cli.js compress - - --algorithm rle > output.rle

# Decompress from stdin to stdout
cat output.rle | node cli.js decompress - - --algorithm rle > decompressed.txt

# Rust version
cat input.txt | cargo run -- compress - - --algorithm rle > output.rle
cat output.rle | cargo run -- decompress - - --algorithm rle > decompressed.txt
```

### 2. File Type Detection

The compressor can automatically detect file types and choose the best algorithm:

```bash
# Automatic algorithm selection
node cli.js compress input.txt output --algorithm auto

# Rust version
cargo run -- compress input.txt output --algorithm auto
```

### 3. WASM Support

The Rust implementation can be used in JavaScript through WebAssembly:

```javascript
import init, { compress_rle_wasm, decompress_rle_wasm } from './rust-compressor/pkg/rust_compressor.js';

async function example() {
    await init();
    const data = new Uint8Array([65, 65, 65, 66, 66, 67]);
    const result = compress_rle_wasm(data);
    console.log('Compression ratio:', result.compression_ratio());
}
```

### 4. Multiple File Processing

Process multiple files in a single command:

```bash
# Compress all .txt files
node cli.js compress "*.txt" output_dir --algorithm auto

# Decompress all .rle files
node cli.js decompress "*.rle" output_dir --algorithm rle

# Rust version
cargo run -- compress "*.txt" output_dir --algorithm auto
cargo run -- decompress "*.rle" output_dir --algorithm rle
```

## Usage

### JavaScript Compressor

#### Command Line Usage

```bash
# Compress a file using RLE
node cli.js compress --input input.txt --output compressed.rle --algorithm rle

# Compress a file using LZ77
node cli.js compress --input input.txt --output compressed.lz77 --algorithm lz77 --window-size 2048

# Decompress a file
node cli.js decompress --input compressed.rle --output decompressed.txt --algorithm rle

# Process multiple files
node cli.js compress --input "*.txt" --output compressed_dir --algorithm auto
```

### Rust Compressor

#### Command Line Usage

```bash
# Compress using RLE
cargo run --release -- compress input.txt output.rle --algorithm rle

# Compress using LZ77
cargo run --release -- compress input.txt output.lz77 --algorithm lz77

# Decompress a file
cargo run --release -- decompress output.rle decompressed.txt --algorithm rle

# Process multiple files
cargo run --release -- compress "*.txt" output_dir --algorithm auto
```

## API Documentation

### JavaScript API

#### compressFile(inputPath, outputPath, algorithm, options)

- `inputPath`: Path to input file
- `outputPath`: Path to output file
- `algorithm`: 'rle', 'lz77', or 'auto'
- `options`: Algorithm-specific options (for LZ77: { windowSize: number })
- Returns: Promise with compression statistics

#### decompressFile(inputPath, outputPath, algorithm)

- `inputPath`: Path to compressed file
- `outputPath`: Path to output file
- `algorithm`: 'rle' or 'lz77'
- Returns: Promise with decompression statistics

#### compressStream(algorithm, options)

- `algorithm`: 'rle' or 'lz77'
- `options`: Algorithm-specific options
- Returns: Promise that resolves when compression is complete

#### decompressStream(algorithm)

- `algorithm`: 'rle' or 'lz77'
- Returns: Promise that resolves when decompression is complete

#### compressFiles(inputPaths, outputDir, algorithm, options)

- `inputPaths`: Array of input file paths
- `outputDir`: Output directory
- `algorithm`: 'rle', 'lz77', or 'auto'
- `options`: Algorithm-specific options
- Returns: Promise with array of compression statistics

#### decompressFiles(inputPaths, outputDir, algorithm)

- `inputPaths`: Array of input file paths
- `outputDir`: Output directory
- `algorithm`: 'rle' or 'lz77'
- Returns: Promise with array of decompression statistics

### Rust API

#### Command Line Options

```
USAGE:
    rust-compressor <COMMAND>

COMMANDS:
    compress     Compress a file or stdin
    decompress   Decompress a file or stdin

OPTIONS:
    --algorithm <ALGORITHM>    Compression algorithm [rle, lz77, auto]
```

### Getting Help

- Open an issue on GitHub
- Check the documentation
- Contact via email <michalndoh9@gmail.com>

## References

- [RLE Documentation](https://hydrolix.io/blog/run-length-encoding/)
- [LZ77 Documentation](https://medium.com/@vincentcorbee/lz77-compression-in-javascript-cd2583d2a8bd)
