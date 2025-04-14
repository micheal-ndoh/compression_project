use std::io::{Read, Write};

const WINDOW_SIZE: usize = 1024;

/// Compresses data using LZ77 algorithm
pub fn compress_lz77(data: &[u8]) -> Vec<u8> {
    let mut result = Vec::new();
    let mut i = 0;

    while i < data.len() {
        let mut best_match = (0, 0);

        // Search for the longest match in the sliding window
        for j in (0..i).rev().take(WINDOW_SIZE) {
            let mut length = 0;
            while i + length < data.len() && data[j + length] == data[i + length] {
                length += 1;
            }
            if length > best_match.1 {
                best_match = (i - j, length);
            }
        }

        if best_match.1 > 2 {
            // Encode as a reference (0x01 + distance + length)
            result.push(0x01);
            result.push(best_match.0 as u8);
            result.push(best_match.1 as u8);
            i += best_match.1;
        } else {
            // Encode as a literal (0x00 + byte)
            result.push(0x00);
            result.push(data[i]);
            i += 1;
        }
    }

    result
}

/// Decompresses data that was compressed using LZ77
pub fn decompress_lz77(data: &[u8]) -> Vec<u8> {
    let mut result = Vec::new();
    let mut i = 0;

    while i < data.len() {
        if data[i] == 0x00 {
            // Literal
            result.push(data[i + 1]);
            i += 2;
        } else if data[i] == 0x01 {
            // Reference
            let distance = data[i + 1] as usize;
            let length = data[i + 2] as usize;

            for j in 0..length {
                result.push(result[result.len() - distance]);
            }

            i += 3;
        }
    }

    result
}

/// Compresses a file using LZ77
pub fn compress_file_lz77(input_path: &str, output_path: &str) -> anyhow::Result<()> {
    let mut input_file = std::fs::File::open(input_path)?;
    let mut input_data = Vec::new();
    input_file.read_to_end(&mut input_data)?;

    let compressed = compress_lz77(&input_data);

    let mut output_file = std::fs::File::create(output_path)?;
    output_file.write_all(&compressed)?;

    Ok(())
}

/// Decompresses a file that was compressed using LZ77
pub fn decompress_file_lz77(input_path: &str, output_path: &str) -> anyhow::Result<()> {
    let mut input_file = std::fs::File::open(input_path)?;
    let mut input_data = Vec::new();
    input_file.read_to_end(&mut input_data)?;

    let decompressed = decompress_lz77(&input_data);

    let mut output_file = std::fs::File::create(output_path)?;
    output_file.write_all(&decompressed)?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_compress_lz77() {
        let input = b"ABABABAB";
        let compressed = compress_lz77(input);
        let decompressed = decompress_lz77(&compressed);
        assert_eq!(input, decompressed.as_slice());
    }

    #[test]
    fn test_compress_lz77_repeated_phrases() {
        let input = b"Hello Hello World World World";
        let compressed = compress_lz77(input);
        let decompressed = decompress_lz77(&compressed);
        assert_eq!(input, decompressed.as_slice());
    }

    #[test]
    fn test_compress_lz77_single_byte() {
        let input = b"A";
        let compressed = compress_lz77(input);
        let decompressed = decompress_lz77(&compressed);
        assert_eq!(input, decompressed.as_slice());
    }

    #[test]
    fn test_compress_lz77_empty() {
        let input = b"";
        let compressed = compress_lz77(input);
        let decompressed = decompress_lz77(&compressed);
        assert_eq!(input, decompressed.as_slice());
    }

    #[test]
    fn test_compress_lz77_binary() {
        let input = vec![0, 1, 2, 0, 1, 2, 3, 4, 5];
        let compressed = compress_lz77(&input);
        let decompressed = decompress_lz77(&compressed);
        assert_eq!(input, decompressed);
    }
}
