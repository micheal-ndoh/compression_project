const fs = require('fs').promises;
const path = require('path');
const { detectFileType, suggestAlgorithm } = require('../file-type');

// Helper function to create test files
async function createTestFile(filename, content) {
    const filePath = path.join(__dirname, 'temp', filename);
    await fs.mkdir(path.join(__dirname, 'temp'), { recursive: true });
    await fs.writeFile(filePath, content);
    return filePath;
}

// Clean up helper
async function cleanup() {
    try {
        await fs.rm(path.join(__dirname, 'temp'), { recursive: true });
    } catch (error) {
        // Ignore if directory doesn't exist
    }
}

describe('File Type Detection', () => {
    beforeAll(async () => {
        await cleanup();
    });

    afterAll(async () => {
        await cleanup();
    });

    test('detects text files correctly', async () => {
        const textFile = await createTestFile('test.txt', 'Hello, World!');
        const mimeType = await detectFileType(textFile);
        expect(mimeType).toBe('text/plain');
    });

    test('detects JSON files correctly', async () => {
        const jsonFile = await createTestFile('test.json', '{"test": "data"}');
        const mimeType = await detectFileType(jsonFile);
        expect(mimeType).toBe('application/json');
    });

    test('handles non-existent files', async () => {
        await expect(detectFileType('nonexistent.txt'))
            .rejects.toThrow('Failed to detect file type');
    });

    test('detects unknown file types as octet-stream', async () => {
        const unknownFile = await createTestFile('test.xyz', 'Random content');
        const mimeType = await detectFileType(unknownFile);
        expect(mimeType).toBe('application/octet-stream');
    });
});

describe('Algorithm Suggestion', () => {
    test('suggests RLE for text files', () => {
        expect(suggestAlgorithm('text/plain')).toBe('rle');
        expect(suggestAlgorithm('text/html')).toBe('rle');
        expect(suggestAlgorithm('text/css')).toBe('rle');
    });

    test('suggests RLE for JSON and XML', () => {
        expect(suggestAlgorithm('application/json')).toBe('rle');
        expect(suggestAlgorithm('application/xml')).toBe('rle');
    });

    test('suggests LZ77 for binary files', () => {
        expect(suggestAlgorithm('image/png')).toBe('lz77');
        expect(suggestAlgorithm('image/jpeg')).toBe('lz77');
        expect(suggestAlgorithm('application/octet-stream')).toBe('lz77');
    });

    test('suggests LZ77 for compressed files', () => {
        expect(suggestAlgorithm('application/zip')).toBe('lz77');
        expect(suggestAlgorithm('application/x-gzip')).toBe('lz77');
        expect(suggestAlgorithm('application/x-bzip2')).toBe('lz77');
    });
}); 