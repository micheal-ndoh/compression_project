use std::io::{Read, Write};

/// Compresses data using Run-Length Encoding (RLE)
pub fn compress_rle(data: &[u8]) -> Vec<u8> {
    let mut result = Vec::new();
    let mut count = 1;
    let mut i = 0;

    while i < data.len() {
        if i + 1 < data.len() && data[i] == data[i + 1] {
            count += 1;
        } else {
            result.push(count);
            result.push(data[i]);
            count = 1;
        }
        i += 1;
    }

    result
}

/// Decompresses data that was compressed using RLE
pub fn decompress_rle(data: &[u8]) -> Vec<u8> {
    let mut result = Vec::new();
    let mut i = 0;

    while i < data.len() {
        let count = data[i] as usize;
        let value = data[i + 1];
        result.extend(std::iter::repeat(value).take(count));
        i += 2;
    }

    result
}

/// Compresses a file using RLE
pub fn compress_file_rle(input_path: &str, output_path: &str) -> anyhow::Result<()> {
    let mut input_file = std::fs::File::open(input_path)?;
    let mut input_data = Vec::new();
    input_file.read_to_end(&mut input_data)?;

    let compressed = compress_rle(&input_data);

    let mut output_file = std::fs::File::create(output_path)?;
    output_file.write_all(&compressed)?;

    Ok(())
}

/// Decompresses a file that was compressed using RLE
pub fn decompress_file_rle(input_path: &str, output_path: &str) -> anyhow::Result<()> {
    let mut input_file = std::fs::File::open(input_path)?;
    let mut input_data = Vec::new();
    input_file.read_to_end(&mut input_data)?;

    let decompressed = decompress_rle(&input_data);

    let mut output_file = std::fs::File::create(output_path)?;
    output_file.write_all(&decompressed)?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_compress_rle() {
        let input = b"AAAABBBCCDAA";
        let compressed = compress_rle(input);
        let decompressed = decompress_rle(&compressed);
        assert_eq!(input, decompressed.as_slice());
    }

    #[test]
    fn test_compress_rle_binary() {
        let input = vec![0, 0, 0, 1, 1, 2, 2, 2, 2];
        let compressed = compress_rle(&input);
        let decompressed = decompress_rle(&compressed);
        assert_eq!(input, decompressed);
    }

    #[test]
    fn test_compress_rle_single_byte() {
        let input = b"A";
        let compressed = compress_rle(input);
        let decompressed = decompress_rle(&compressed);
        assert_eq!(input, decompressed.as_slice());
    }

    #[test]
    fn test_compress_rle_empty() {
        let input = b"";
        let compressed = compress_rle(input);
        let decompressed = decompress_rle(&compressed);
        assert_eq!(input, decompressed.as_slice());
    }
}
