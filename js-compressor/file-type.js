const fs = require('fs');
const path = require('path');

// Magic numbers for common file types
const MAGIC_NUMBERS = {
    // Text files
    'text/plain': [
        [0xEF, 0xBB, 0xBF], // UTF-8 with BOM
        [0xFF, 0xFE],       // UTF-16 LE
        [0xFE, 0xFF],       // UTF-16 BE
    ],
    // Image files
    'image/png': [[0x89, 0x50, 0x4E, 0x47]],
    'image/jpeg': [[0xFF, 0xD8, 0xFF]],
    'image/gif': [[0x47, 0x49, 0x46, 0x38]],
    // Archive files
    'application/zip': [[0x50, 0x4B, 0x03, 0x04]],
    'application/x-gzip': [[0x1F, 0x8B]],
    'application/x-bzip2': [[0x42, 0x5A, 0x68]],
};


async function detectFileType(filePath) {
    try {
        const buffer = await fs.promises.readFile(filePath, { end: 4 });
        const extension = path.extname(filePath).toLowerCase();

        // Check magic numbers
        for (const [mimeType, signatures] of Object.entries(MAGIC_NUMBERS)) {
            for (const signature of signatures) {
                if (buffer.slice(0, signature.length).equals(Buffer.from(signature))) {
                    return mimeType;
                }
            }
        }

        // Fallback to extension-based detection
        const extensionToMime = {
            '.txt': 'text/plain',
            '.csv': 'text/csv',
            '.json': 'application/json',
            '.xml': 'application/xml',
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.zip': 'application/zip',
            '.gz': 'application/x-gzip',
            '.bz2': 'application/x-bzip2',
        };

        return extensionToMime[extension] || 'application/octet-stream';
    } catch (error) {
        throw new Error(`Failed to detect file type: ${error.message}`);
    }
}

/**
 * Suggests the best compression algorithm based on file type
 * @param {string} mimeType - MIME type of the file
 * @returns {string} - Suggested algorithm ('rle' or 'lz77')
 */
function suggestAlgorithm(mimeType) {
    // RLE is better for files with repeated patterns
    if (mimeType.startsWith('text/') || mimeType === 'application/json' || mimeType === 'application/xml') {
        return 'rle';
    }
    // LZ77 is better for binary files and already compressed files
    return 'lz77';
}

module.exports = {
    detectFileType,
    suggestAlgorithm
}; 