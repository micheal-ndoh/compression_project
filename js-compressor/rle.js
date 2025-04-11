/**
 * Run-Length Encoding (RLE) compression and decompression
 */

function compressRLE(data) {
    let result = [];
    let count = 1;

    for (let i = 0; i < data.length; i++) {
        if (i + 1 < data.length && data[i] === data[i + 1]) {
            count++;
        } else {
            result.push(count, data[i]);
            count = 1;
        }
    }

    return Buffer.from(result);
}

function decompressRLE(data) {
    let result = [];

    for (let i = 0; i < data.length; i += 2) {
        const count = data[i];
        const value = data[i + 1];
        result.push(...Array(count).fill(value));
    }

    return Buffer.from(result);
}

module.exports = {
    compress: compressRLE,
    decompress: decompressRLE
}; 