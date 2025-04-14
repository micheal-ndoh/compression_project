pub mod lz77;
pub mod rle;

pub use lz77::{compress_lz77, decompress_lz77};
pub use rle::{compress_rle, decompress_rle};
