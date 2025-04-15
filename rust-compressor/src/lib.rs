pub mod file_type;
pub mod lz77;
pub mod rle;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct CompressionResult {
    data: Vec<u8>,
    original_size: usize,
    compressed_size: usize,
}

#[wasm_bindgen]
impl CompressionResult {
    #[wasm_bindgen(getter)]
    pub fn data(&self) -> Vec<u8> {
        self.data.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn original_size(&self) -> usize {
        self.original_size
    }

    #[wasm_bindgen(getter)]
    pub fn compressed_size(&self) -> usize {
        self.compressed_size
    }

    #[wasm_bindgen(getter)]
    pub fn compression_ratio(&self) -> f64 {
        (self.compressed_size as f64) / (self.original_size as f64)
    }
}

#[wasm_bindgen]
pub fn compress_rle_wasm(data: &[u8]) -> CompressionResult {
    let compressed = rle::compress_rle(data);
    CompressionResult {
        data: compressed.clone(),
        original_size: data.len(),
        compressed_size: compressed.len(),
    }
}

#[wasm_bindgen]
pub fn decompress_rle_wasm(data: &[u8]) -> CompressionResult {
    let decompressed = rle::decompress_rle(data);
    CompressionResult {
        data: decompressed.clone(),
        original_size: data.len(),
        compressed_size: decompressed.len(),
    }
}

#[wasm_bindgen]
pub fn compress_lz77_wasm(data: &[u8]) -> CompressionResult {
    let compressed = lz77::compress_lz77(data);
    CompressionResult {
        data: compressed.clone(),
        original_size: data.len(),
        compressed_size: compressed.len(),
    }
}

#[wasm_bindgen]
pub fn decompress_lz77_wasm(data: &[u8]) -> CompressionResult {
    let decompressed = lz77::decompress_lz77(data);
    CompressionResult {
        data: decompressed.clone(),
        original_size: data.len(),
        compressed_size: decompressed.len(),
    }
}

#[wasm_bindgen]
pub fn suggest_algorithm_wasm(data: &[u8]) -> String {
    // Try to detect if the data is text
    if data.iter().all(|&b| {
        b.is_ascii()
            && (b.is_ascii_alphanumeric() || b.is_ascii_whitespace() || b.is_ascii_punctuation())
    }) {
        "rle".to_string()
    } else {
        "lz77".to_string()
    }
}
