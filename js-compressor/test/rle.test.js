const { compressRLE, decompressRLE } = require('../rle');

describe('Run-Length Encoding (RLE)', () => {
    test('compresses simple repeated data', () => {
        const input = Buffer.from('AAAABBBCCDAA');
        const compressed = compressRLE(input);
        const decompressed = decompressRLE(compressed);

        expect(decompressed).toEqual(input);
        expect(compressed.length).toBeLessThan(input.length);
    });

    test('compresses binary data', () => {
        const input = Buffer.from([0, 0, 0, 1, 1, 2, 2, 2, 2]);
        const compressed = compressRLE(input);
        const decompressed = decompressRLE(compressed);

        expect(decompressed).toEqual(input);
    });

    test('handles single bytes', () => {
        const input = Buffer.from('A');
        const compressed = compressRLE(input);
        const decompressed = decompressRLE(compressed);

        expect(decompressed).toEqual(input);
    });

    test('handles empty input', () => {
        const input = Buffer.from('');
        const compressed = compressRLE(input);
        const decompressed = decompressRLE(compressed);

        expect(decompressed).toEqual(input);
    });

    test('handles non-repeating data', () => {
        const input = Buffer.from('ABCDEF');
        const compressed = compressRLE(input);
        const decompressed = decompressRLE(compressed);

        expect(decompressed).toEqual(input);
    });
}); 