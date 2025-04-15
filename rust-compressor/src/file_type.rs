use std::fs::File;
use std::io::Read;
use std::path::Path;

// Magic numbers for common file types
const MAGIC_NUMBERS: &[(&str, &[&[u8]])] = &[
    // Text files
    (
        "text/plain",
        &[
            &[0xEF, 0xBB, 0xBF], // UTF-8 with BOM
            &[0xFF, 0xFE],       // UTF-16 LE
            &[0xFE, 0xFF],       // UTF-16 BE
        ],
    ),
    // Image files
    ("image/png", &[&[0x89, 0x50, 0x4E, 0x47]]),
    ("image/jpeg", &[&[0xFF, 0xD8, 0xFF]]),
    ("image/gif", &[&[0x47, 0x49, 0x46, 0x38]]),
    // Archive files
    ("application/zip", &[&[0x50, 0x4B, 0x03, 0x04]]),
    ("application/x-gzip", &[&[0x1F, 0x8B]]),
    ("application/x-bzip2", &[&[0x42, 0x5A, 0x68]]),
];

/// Detects the file type based on magic numbers and extension
pub fn detect_file_type(file_path: &str) -> anyhow::Result<String> {
    let path = Path::new(file_path);
    let mut file = File::open(file_path)?;
    let mut buffer = vec![0; 4];
    file.read_exact(&mut buffer)?;

    // Check magic numbers
    for (mime_type, signatures) in MAGIC_NUMBERS {
        for signature in *signatures {
            if buffer.starts_with(signature) {
                return Ok(mime_type.to_string());
            }
        }
    }

    // Fallback to extension-based detection
    let extension = path
        .extension()
        .and_then(|ext| ext.to_str())
        .map(|ext| ext.to_lowercase())
        .unwrap_or_default();

    let mime_type = match extension.as_str() {
        "txt" => "text/plain",
        "csv" => "text/csv",
        "json" => "application/json",
        "xml" => "application/xml",
        "html" => "text/html",
        "css" => "text/css",
        "js" => "application/javascript",
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "gif" => "image/gif",
        "zip" => "application/zip",
        "gz" => "application/x-gzip",
        "bz2" => "application/x-bzip2",
        _ => "application/octet-stream",
    };

    Ok(mime_type.to_string())
}

/// Suggests the best compression algorithm based on file type
pub fn suggest_algorithm(mime_type: &str) -> &'static str {
    // RLE is better for files with repeated patterns
    if mime_type.starts_with("text/")
        || mime_type == "application/json"
        || mime_type == "application/xml"
    {
        "rle"
    } else {
        // LZ77 is better for binary files and already compressed files
        "lz77"
    }
}
