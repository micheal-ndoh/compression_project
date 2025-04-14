const fs = require('fs');
const { compressRLE, decompressRLE } = require('./rle');
const { compressLZ77, decompressLZ77 } = require('./lz');

/**
 * Validates file paths and checks if files exist
 * @param {string} inputPath - Path to the input file
 * @param {string} outputPath - Path to the output file
 * @param {boolean} checkInputExists - Whether to check if input file exists
 * @returns {Promise<void>}
 * @throws {Error} If paths are invalid or files don't exist
 */
async function validatePaths(inputPath, outputPath, checkInputExists = true) {
    if (!inputPath || typeof inputPath !== 'string') {
        throw new Error('Invalid input path');
    }
    if (!outputPath || typeof outputPath !== 'string') {
        throw new Error('Invalid output path');
    }
    if (checkInputExists) {
        try {
            await fs.promises.access(inputPath, fs.constants.F_OK);
        } catch {
            throw new Error(`Input file does not exist: ${inputPath}`);
        }
    }
}

/**
 * Compresses a file using the specified algorithm
 * @param {string} inputPath - Path to the input file
 * @param {string} outputPath - Path to the output file
 * @param {string} algorithm - Compression algorithm to use ('rle' or 'lz77')
 * @param {Object} options - Algorithm-specific options
 * @returns {Promise<Object>} Compression statistics
 */
async function compressFile(inputPath, outputPath, algorithm, options = {}) {
    try {
        await validatePaths(inputPath, outputPath);

        const data = await fs.promises.readFile(inputPath);
        let compressed;
        const startTime = process.hrtime();

        if (algorithm === 'rle') {
            compressed = compressRLE(data);
        } else if (algorithm === 'lz77') {
            compressed = compressLZ77(data, options);
        } else {
            throw new Error('Invalid algorithm specified. Use either "rle" or "lz77"');
        }

        await fs.promises.writeFile(outputPath, compressed);

        const [seconds, nanoseconds] = process.hrtime(startTime);
        const compressionTime = seconds + nanoseconds / 1e9;

        return {
            originalSize: data.length,
            compressedSize: compressed.length,
            compressionRatio: (compressed.length / data.length).toFixed(2),
            compressionTime: compressionTime.toFixed(3),
            algorithm: algorithm,
            options: options
        };
    } catch (error) {
        throw new Error(`Compression failed: ${error.message}`);
    }
}

/**
 * Decompresses a file using the specified algorithm
 * @param {string} inputPath - Path to the input file
 * @param {string} outputPath - Path to the output file
 * @param {string} algorithm - Compression algorithm to use ('rle' or 'lz77')
 * @returns {Promise<Object>} Decompression statistics
 */
async function decompressFile(inputPath, outputPath, algorithm) {
    try {
        await validatePaths(inputPath, outputPath);

        const data = await fs.promises.readFile(inputPath);
        let decompressed;
        const startTime = process.hrtime();

        if (algorithm === 'rle') {
            decompressed = decompressRLE(data);
        } else if (algorithm === 'lz77') {
            decompressed = decompressLZ77(data);
        } else {
            throw new Error('Invalid algorithm specified. Use either "rle" or "lz77"');
        }

        await fs.promises.writeFile(outputPath, decompressed);

        const [seconds, nanoseconds] = process.hrtime(startTime);
        const decompressionTime = seconds + nanoseconds / 1e9;

        return {
            compressedSize: data.length,
            decompressedSize: decompressed.length,
            decompressionTime: decompressionTime.toFixed(3),
            algorithm: algorithm
        };
    } catch (error) {
        throw new Error(`Decompression failed: ${error.message}`);
    }
}

module.exports = {
    compressFile,
    decompressFile
}; 