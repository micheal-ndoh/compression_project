/**
 * Compresses data using Run-Length Encoding (RLE)
 * @param {Buffer} data - The input data to compress
 * @returns {Buffer} - The compressed data
 * @throws {Error} If input is not a Buffer or is empty
 */
function compressRLE(data) {
    if (!Buffer.isBuffer(data)) {
        throw new Error('Input must be a Buffer');
    }
    if (data.length === 0) {
        throw new Error('Input data cannot be empty');
    }

    let result = [];
    let count = 1;

    for (let i = 0; i < data.length; i++) {
        if (i + 1 < data.length && data[i] === data[i + 1]) {
            count++;
            // Prevent count overflow (max 255 for a byte)
            if (count > 255) {
                result.push(255, data[i]);
                count = 1;
            }
        } else {
            result.push(count, data[i]);
            count = 1;
        }
    }

    return Buffer.from(result);
}

/**
 * Decompresses data that was compressed using RLE
 * @param {Buffer} data - The compressed data
 * @returns {Buffer} - The decompressed data
 * @throws {Error} If input is not a Buffer, is empty, or has invalid format
 */
function decompressRLE(data) {
    if (!Buffer.isBuffer(data)) {
        throw new Error('Input must be a Buffer');
    }
    if (data.length === 0) {
        throw new Error('Input data cannot be empty');
    }
    if (data.length % 2 !== 0) {
        throw new Error('Invalid RLE format: data length must be even');
    }

    let result = [];

    for (let i = 0; i < data.length; i += 2) {
        const count = data[i];
        const value = data[i + 1];

        if (count === 0) {
            throw new Error('Invalid RLE format: count cannot be zero');
        }

        for (let j = 0; j < count; j++) {
            result.push(value);
        }
    }

    return Buffer.from(result);
}

module.exports = {
    compressRLE,
    decompressRLE
}; 