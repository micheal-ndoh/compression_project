const fs = require('fs');
const { compressRLE, decompressRLE } = require('./rle');
const { compressLZ77, decompressLZ77 } = require('./lz');
const { Transform } = require('stream');
const { detectFileType, suggestAlgorithm } = require('./file-type');
const path = require('path');


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

/**
 * Creates a transform stream for compression
 * @param {string} algorithm - 'rle' or 'lz77'
 * @param {Object} options - Algorithm-specific options
 * @returns {Transform} - A transform stream
 */
function createCompressStream(algorithm, options = {}) {
    return new Transform({
        transform(chunk, encoding, callback) {
            try {
                let compressed;
                if (algorithm === 'rle') {
                    compressed = compressRLE(chunk);
                } else if (algorithm === 'lz77') {
                    compressed = compressLZ77(chunk, options);
                } else {
                    callback(new Error('Invalid algorithm specified. Use either "rle" or "lz77"'));
                    return;
                }
                callback(null, compressed);
            } catch (error) {
                callback(error);
            }
        }
    });
}

/**
 * Creates a transform stream for decompression
 * @param {string} algorithm - 'rle' or 'lz77'
 * @returns {Transform} - A transform stream
 */
function createDecompressStream(algorithm) {
    return new Transform({
        transform(chunk, encoding, callback) {
            try {
                let decompressed;
                if (algorithm === 'rle') {
                    decompressed = decompressRLE(chunk);
                } else if (algorithm === 'lz77') {
                    decompressed = decompressLZ77(chunk);
                } else {
                    callback(new Error('Invalid algorithm specified. Use either "rle" or "lz77"'));
                    return;
                }
                callback(null, decompressed);
            } catch (error) {
                callback(error);
            }
        }
    });
}

/**
 * Compresses data from stdin to stdout
 * @param {string} algorithm - 'rle' or 'lz77'
 * @param {Object} options - Algorithm-specific options
 * @returns {Promise} - Resolves when compression is complete
 */
async function compressStream(algorithm, options = {}) {
    return new Promise((resolve, reject) => {
        process.stdin
            .pipe(createCompressStream(algorithm, options))
            .pipe(process.stdout)
            .on('finish', resolve)
            .on('error', reject);
    });
}

/**
 * Decompresses data from stdin to stdout
 * @param {string} algorithm - 'rle' or 'lz77'
 * @returns {Promise} - Resolves when decompression is complete
 */
async function decompressStream(algorithm) {
    return new Promise((resolve, reject) => {
        process.stdin
            .pipe(createDecompressStream(algorithm))
            .pipe(process.stdout)
            .on('finish', resolve)
            .on('error', reject);
    });
}

/**
 * Compresses multiple files
 * @param {string[]} inputPaths - Array of input file paths
 * @param {string} outputDir - Output directory
 * @param {string} algorithm - 'rle', 'lz77', or 'auto'
 * @param {Object} options - Algorithm-specific options
 * @returns {Promise<Object[]>} - Array of compression statistics
 */
async function compressFiles(inputPaths, outputDir, algorithm = 'auto', options = {}) {
    const results = [];

    for (const inputPath of inputPaths) {
        try {
            const outputPath = path.join(outputDir, path.basename(inputPath) +
                (algorithm === 'rle' ? '.rle' : '.lz77'));

            // Detect file type and suggest algorithm if auto is selected
            const mimeType = await detectFileType(inputPath);
            const selectedAlgorithm = algorithm === 'auto' ?
                suggestAlgorithm(mimeType) : algorithm;

            const stats = await compressFile(inputPath, outputPath, selectedAlgorithm, options);
            results.push({
                input: inputPath,
                output: outputPath,
                algorithm: selectedAlgorithm,
                ...stats
            });
        } catch (error) {
            results.push({
                input: inputPath,
                error: error.message
            });
        }
    }

    return results;
}

/**
 * Decompresses multiple files
 * @param {string[]} inputPaths - Array of input file paths
 * @param {string} outputDir - Output directory
 * @param {string} algorithm - 'rle' or 'lz77'
 * @returns {Promise<Object[]>} - Array of decompression statistics
 */
async function decompressFiles(inputPaths, outputDir, algorithm) {
    const results = [];

    for (const inputPath of inputPaths) {
        try {
            const outputPath = path.join(outputDir, path.basename(inputPath)
                .replace(/\.(rle|lz77)$/, ''));

            const stats = await decompressFile(inputPath, outputPath, algorithm);
            results.push({
                input: inputPath,
                output: outputPath,
                algorithm,
                ...stats
            });
        } catch (error) {
            results.push({
                input: inputPath,
                error: error.message
            });
        }
    }

    return results;
}

module.exports = {
    compressFile,
    decompressFile,
    compressStream,
    decompressStream,
    createCompressStream,
    createDecompressStream,
    compressFiles,
    decompressFiles
}; 