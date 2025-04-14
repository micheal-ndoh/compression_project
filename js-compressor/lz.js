
function compressLZ77(data, options = {}) {
    if (!Buffer.isBuffer(data)) {
        throw new Error('Input must be a Buffer');
    }
    if (data.length === 0) {
        throw new Error('Input data cannot be empty');
    }

    const WINDOW_SIZE = Math.min(Math.max(options.windowSize || 1024, 32), 32768); // Limit window size
    const result = [];
    let i = 0;

    while (i < data.length) {
        let bestMatch = { distance: 0, length: 0 };
        const windowStart = Math.max(0, i - WINDOW_SIZE);

        // Search for the longest match in the sliding window
        for (let j = windowStart; j < i; j++) {
            let length = 0;
            while (i + length < data.length &&
                data[j + length] === data[i + length] &&
                length < 255) { // Limit match length
                length++;
            }
            if (length > bestMatch.length) {
                bestMatch = { distance: i - j, length };
            }
        }

        if (bestMatch.length > 2) {
            // Encode as a reference (0x01 + distance + length)
            result.push(0x01, bestMatch.distance, bestMatch.length);
            i += bestMatch.length;
        } else {
            // Encode as a literal (0x00 + byte)
            result.push(0x00, data[i]);
            i++;
        }
    }

    return Buffer.from(result);
}


function decompressLZ77(data) {
    if (!Buffer.isBuffer(data)) {
        throw new Error('Input must be a Buffer');
    }
    if (data.length === 0) {
        throw new Error('Input data cannot be empty');
    }

    const result = [];
    let i = 0;

    while (i < data.length) {
        if (data[i] === 0x00) {
            // Literal
            if (i + 1 >= data.length) {
                throw new Error('Invalid LZ77 format: incomplete literal');
            }
            result.push(data[i + 1]);
            i += 2;
        } else if (data[i] === 0x01) {
            // Reference
            if (i + 2 >= data.length) {
                throw new Error('Invalid LZ77 format: incomplete reference');
            }
            const distance = data[i + 1];
            const length = data[i + 2];

            if (distance === 0 || length === 0) {
                throw new Error('Invalid LZ77 format: zero distance or length');
            }
            if (result.length < distance) {
                throw new Error('Invalid LZ77 format: reference exceeds available data');
            }

            for (let j = 0; j < length; j++) {
                result.push(result[result.length - distance]);
            }

            i += 3;
        } else {
            throw new Error('Invalid LZ77 format: unknown token');
        }
    }

    return Buffer.from(result);
}

module.exports = {
    compressLZ77,
    decompressLZ77
}; 