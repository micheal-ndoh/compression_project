const { compressLZ77, decompressLZ77 } = require('../lz');

describe('LZ77 Compression', () => {
    test('compresses repeated patterns', () => {
        const input = Buffer.from('ABABABAB');
        const compressed = compressLZ77(input);
        const decompressed = decompressLZ77(compressed);

        expect(decompressed).toEqual(input);
        expect(compressed.length).toBeLessThan(input.length);
    });

    test('compresses text with repeated phrases', () => {
        const input = Buffer.from('Hello Hello World World World');
        const compressed = compressLZ77(input);
        const decompressed = decompressLZ77(compressed);

        expect(decompressed).toEqual(input);
    });

    test('handles single bytes', () => {
        const input = Buffer.from('A');
        const compressed = compressLZ77(input);
        const decompressed = decompressLZ77(compressed);

        expect(decompressed).toEqual(input);
    });

    test('handles empty input', () => {
        const input = Buffer.from('');
        const compressed = compressLZ77(input);
        const decompressed = decompressLZ77(compressed);

        expect(decompressed).toEqual(input);
    });

    test('handles non-repeating data', () => {
        const input = Buffer.from('ABCDEF');
        const compressed = compressLZ77(input);
        const decompressed = decompressLZ77(compressed);

        expect(decompressed).toEqual(input);
    });

    test('compresses binary data', () => {
        const input = Buffer.from([0, 1, 2, 0, 1, 2, 3, 4, 5]);
        const compressed = compressLZ77(input);
        const decompressed = decompressLZ77(compressed);

        expect(decompressed).toEqual(input);
    });
}); 