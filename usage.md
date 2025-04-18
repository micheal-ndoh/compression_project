# Usage Guide

## Installation

### JavaScript Version

```bash
cd js-compressor
npm install
```

### Rust Version

```bash
cd rust-compressor
cargo build
```

## Basic Usage

### JavaScript Version

#### Single File Compression

```bash
node index.js compress input.txt output.rle --algorithm rle
```

#### Single File Decompression

```bash
node index.js decompress input.rle output.txt --algorithm rle
```

#### Multiple File Processing

```bash
node index.js compress "*.txt" output_dir --algorithm auto
```

### Rust Version

#### Single File Compression

```bash
cargo run -- compress input.txt output.rle --algorithm rle
```

#### Single File Decompression

```bash
cargo run -- decompress input.rle output.txt --algorithm rle
```

#### Multiple File Processing

```bash
cargo run -- compress "*.txt" output_dir --algorithm auto
```

## Command Line Options

### Common Options

- `--algorithm`: Specify compression algorithm (rle, lz77, or auto)
- `--help`: Show help message
- `--version`: Show version information

### JavaScript Specific

- `--stream`: Enable streaming mode
- `--buffer-size`: Set buffer size for streaming

### Rust Specific

- `--threads`: Number of threads for parallel processing
- `--window-size`: LZ77 window size

## Examples

### Compress a Text File

```bash
# JavaScript
node index.js compress document.txt compressed.rle --algorithm rle

# Rust
cargo run -- compress document.txt compressed.rle --algorithm rle
```

### Decompress a File

```bash
# JavaScript
node index.js decompress compressed.rle document.txt --algorithm rle

# Rust
cargo run -- decompress compressed.rle document.txt --algorithm rle
```

### Process Multiple Files

```bash
# JavaScript
node index.js compress "*.txt" compressed/ --algorithm auto

# Rust
cargo run -- compress "*.txt" compressed/ --algorithm auto
```

### Stream Processing

```bash
# JavaScript
cat input.txt | node index.js compress - - --algorithm rle > output.rle

# Rust
cat input.txt | cargo run -- compress - - --algorithm rle > output.rle
```

## Output Directory Structure

Both implementations automatically create and manage the following directory structure:

```
project/
├── output/
│   ├── compressed/    # Compressed files
│   └── decompressed/  # Decompressed files
```

## Algorithm Selection

### Automatic Selection

- Uses file type detection
- Analyzes content patterns
- Selects best algorithm based on file characteristics

### Manual Selection

- `rle`: Best for files with repeated values
- `lz77`: Best for general-purpose compression
- `auto`: Let the system choose the best algorithm

## Performance Tips

1. **File Size**
   - For small files (< 1MB): Use RLE
   - For large files: Use LZ77

2. **Content Type**
   - Text files: Try both algorithms
   - Binary files: Use LZ77
   - Images: Use RLE for simple formats

3. **Memory Usage**
   - Use streaming mode for large files
   - Adjust buffer size based on available memory

## Error Handling

Common errors and solutions:

1. **File Not Found**
   - Check file path
   - Ensure file exists
   - Verify permissions

2. **Invalid Algorithm**
   - Use supported algorithms (rle, lz77)
   - Check algorithm spelling

3. **Output Directory Issues**
   - Check permissions
   - Ensure disk space
   - Verify path validity

## Troubleshooting

1. **Compression Issues**
   - Check file type
   - Try different algorithm
   - Verify file integrity

2. **Decompression Issues**
   - Ensure correct algorithm
   - Check file format
   - Verify file headers

3. **Performance Issues**
   - Adjust buffer size
   - Use streaming mode
   - Check system resources
