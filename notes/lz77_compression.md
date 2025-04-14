# LZ77 Compression

## What is LZ77?
LZ77 is a lossless data compression algorithm that works by finding repeated sequences of data and replacing them with references to previous occurrences. It's one of the foundational algorithms in data compression and is used in many modern compression formats.

## How it Works
LZ77 works by maintaining a "sliding window" of recently seen data. When it encounters a sequence of bytes that it has seen before, it replaces that sequence with a reference to the previous occurrence. The reference consists of:
1. The distance back to the start of the matching sequence
2. The length of the matching sequence
3. The next character after the match

### Example:
Consider the string: `"ABABABAB"`

The compression process would work like this:
1. First "AB" is stored as is
2. The next "AB" is replaced with a reference to the first "AB"
3. This continues for the rest of the string

## Implementation in This Project
In this project, LZ77 is used as one of the compression algorithms. The implementation needs to:
1. Read the input file
2. Compress the data using LZ77
3. Write the compressed data to an output file
4. Support decompression to restore the original data

## Code Example
Here's a simplified JavaScript implementation of LZ77:

```javascript
function compressLZ77(input) {
    let result = [];
    let windowSize = 1024; // Size of the sliding window
    let i = 0;

    while (i < input.length) {
        let bestMatch = { distance: 0, length: 0 };
        
        // Search for the longest match in the sliding window
        for (let j = Math.max(0, i - windowSize); j < i; j++) {
            let length = 0;
            while (i + length < input.length && 
                   input[j + length] === input[i + length]) {
                length++;
            }
            if (length > bestMatch.length) {
                bestMatch = { distance: i - j, length };
            }
        }

        if (bestMatch.length > 2) {
            // Encode as a reference
            result.push(`(${bestMatch.distance},${bestMatch.length})`);
            i += bestMatch.length;
        } else {
            // Encode as a literal
            result.push(input[i]);
            i++;
        }
    }

    return result.join('');
}

function decompressLZ77(input) {
    let result = '';
    let i = 0;

    while (i < input.length) {
        if (input[i] === '(') {
            // Parse reference
            let end = input.indexOf(')', i);
            let [distance, length] = input.slice(i + 1, end)
                .split(',')
                .map(Number);
            
            // Copy the referenced sequence
            for (let j = 0; j < length; j++) {
                result += result[result.length - distance];
            }
            
            i = end + 1;
        } else {
            // Copy literal
            result += input[i];
            i++;
        }
    }

    return result;
}
```

## When to Use LZ77
- Good for text files and general data
- Better than RLE for data with complex patterns
- More complex to implement than RLE
- Can achieve better compression ratios for many types of data

## Learning Resources
1. [Wikipedia: LZ77 and LZ78](https://en.wikipedia.org/wiki/LZ77_and_LZ78)
2. [GeeksforGeeks: LZ77 Data Compression](https://www.geeksforgeeks.org/lz77-data-compression/)
3. [Data Compression: LZ77](https://www.cs.duke.edu/csed/curious/compression/lz77.html)
