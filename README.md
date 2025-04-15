# Compression Project

This project implements RLE (Run-Length Encoding) and LZ77 compression algorithms in both Rust and JavaScript. It provides both containerized and local installation options.

## Table of Contents

- [Docker Installation](#docker-installation)
- [Local Installation](#local-installation)
- [Usage](#usage)
  - [JavaScript Compressor](#javascript-compressor)
  - [Rust Compressor](#rust-compressor)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## Docker Installation

### Pull the Docker Image

```bash
docker pull your-registry/compression-project:latest
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
```

### Rust Compressor

#### Command Line Usage

```bash
# Navigate to rust-compressor directory
cd rust-compressor

# Compress using RLE
cargo run --release -- compress input.txt output.txt --algorithm rle

# Compress using LZ77
cargo run --release -- compress input.txt output.txt --algorithm lz77

# Decompress a file
cargo run --release -- decompress output.txt decompressed.txt --algorithm rle
```

## API Documentation

### JavaScript API

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

### Rust API

#### Command Line Options

```
USAGE:
    rust-compressor <COMMAND>

COMMANDS:
    compress     Compress a file
    decompress   Decompress a file

OPTIONS:
    --algorithm <ALGORITHM>    Compression algorithm [rle, lz77]
```

### Getting Help

- Open an issue on GitHub
- Check the documentation
- Contact via email <michalndoh9@gmail.com>

## References

- [RLE Documentation](https://hydrolix.io/blog/run-length-encoding/)
- [LZ77 Documentation](https://medium.com/@vincentcorbee/lz77-compression-in-javascript-cd2583d2a8bd)
