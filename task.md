# Breaking Break: Compression Tool

## 📚 Project Goal

You're building a compression CLI tool using both Rust and JavaScript, supporting two compression algorithms: Run-Length Encoding (RLE) and Simplified LZ77 (google is your friend). The tool will:

- Compress and decompress files
- Support -rle or -lz flags
- Be packaged as Docker images
- Be published to GitHub Container Registry (GHCR)
- Be tested and benchmarked for performance

## 🛠️ Your Tasks

📁 1. Project Structure

compression-project/
├── rust-compressor/
│   ├── src/
│   ├── Dockerfile
│   └── Cargo.toml
│
├── js-compressor/
│   ├── index.js
│   ├── rle.js
│   ├── lz.js
│   ├── test/
│   │   ├── rle.test.js
│   │   └── lz.test.js
│   ├── package.json
│   └── Dockerfile
│
└── .github/workflows/docker.yml

​
🧠 2. Compression Algorithms

✅ Implement two algorithms:

- Run-Length Encoding (RLE)
  - Byte + Count
- Simplified LZ77
  - Literal: 0x00 + byte
  - Match: 0x01 + offset + length
  - Use a small sliding window (e.g., 20 bytes)
  
You must implement:

- compress_rle(data)
- decompress_rle(data)
- compress_lz(data)
- decompress_lz(data)

## 🖥️ 3. CLI Interface

Build a command-line interface:

```rust
compress|decompress <input_file> <output_file> --rle|--lz
```

- Rust: Parse args in main.rs
- JS: Use process.argv

## 🧪 4. Unit Tests

✅ Rust (in src/rle.rs / src/lz.rs):

- RLE Test in Rust:
  
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rle_roundtrip() {
        let input = b"AAABBBCCCCCDDDDE";
        let compressed = compress(input);
        let decompressed = decompress(&compressed);
        assert_eq!(input.to_vec(), decompressed);
    }
}
```

​

- LZ Test in Rust (simplified example):

```rust

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_lz_roundtrip() {
        let input = b"ABABABABABAB";
        let compressed = compress(input);
        let decompressed = decompress(&compressed);
        assert_eq!(input.to_vec(), decompressed);
    }
}
```

​
✅ JavaScript (in test/rle.test.js, test/lz.test.js)
test/rle.test.js

```rust
const assert = require('assert');
const { compress, decompress } = require('../rle');

describe('RLE Compression', () => {
    it('should compress and decompress correctly', () => {
        const input = Buffer.from('AAABBBCCCCCDDDDE');
        const compressed = compress(input);
        const decompressed = decompress(compressed);
        assert.strictEqual(decompressed.toString(), input.toString());
    });
});
```

test/lz.test.js
​

```rust
const assert = require('assert');
const { compress, decompress } = require('../lz');

describe('LZ Compression', () => {
    it('should compress and decompress correctly', () => {
        const input = Buffer.from('ABABABABABAB');
        const compressed = compress(input);
        const decompressed = decompress(compressed);
        assert.strictEqual(decompressed.toString(), input.toString());
    });
});
```

Run tests using:

```rust
# In JS
npm install mocha
npx mocha test/*.test.js
```

## 🐳 5. Dockerization

- Create a Dockerfile for each:
- Rust: build binary via cargo build --release
- JS: use Node.js base image
- Entrypoint: must expose CLI interface

## 🚀 6. GitHub Actions for CI/CD

- Create a workflow in .github/workflows/docker.yml:
- Build and push Rust and JS Docker images to GHCR
- Use matrix builds for rust-compressor, js-compressor
Image tags:

```rust
ghcr.io/your-org-name/rust-compressor
ghcr.io/your-org-name/js-compressor
```

## 🧪 7. Benchmarking

Write a shell script or markdown report comparing:

- Compression time
- Decompression time
- Output size
- Compression ratio
  
Use time and sample files to test:

```rust
time docker run -v $(pwd):/data rust-compressor compress /data/test.txt /data/test.txt.cmp --rle
```

## 📦 8. Final Deliverable

- ✅ Working CLI in Rust & JS
- ✅ Unit tests for both
- ✅ Two Docker images on GHCR
- ✅ README.md with usage instructions
- ✅ Benchmark report

## 🧑‍🏫 Bonus Challenges (Optional)

- Support stdin/stdout streams
- Add file-type detection for automatic algorithm choice
 -Use wasm to run the Rust code in a JS context
- Support multiple file compression in one run
To the one who’ll successfully check all these points, I’ll have a personal reward (me @Stephane Lambou 😉)
