# Run-Length Encoding (RLE)

## What is Run-Length Encoding?
Run-Length Encoding (RLE) is a simple form of data compression where consecutive identical elements are stored as a single data value and its count, rather than as the original run. It's particularly effective for data that contains many consecutive repeated values.

## How it Works
The basic idea is to replace sequences of the same data value with a single value and a count of how many times it appears.

### Example:
Original data: `AAAABBBCCDAA`
RLE encoded: `4A3B2C1D2A`

## Implementation in This Project
In this project, RLE is used as one of the compression algorithms. The implementation needs to:
1. Read the input file
2. Compress the data using RLE
3. Write the compressed data to an output file
4. Support decompression to restore the original data

## Code Example
Here's a simple JavaScript implementation of RLE:

```javascript
function compressRLE(input) {
    let result = '';
    let count = 1;
    
    for (let i = 0; i < input.length; i++) {
        if (input[i] === input[i + 1]) {
            count++;
        } else {
            result += count + input[i];
            count = 1;
        }
    }
    
    return result;
}

function decompressRLE(input) {
    let result = '';
    let i = 0;
    
    while (i < input.length) {
        let count = '';
        while (!isNaN(input[i])) {
            count += input[i];
            i++;
        }
        result += input[i].repeat(parseInt(count));
        i++;
    }
    
    return result;
}
```

## When to Use RLE
- Best for data with many repeated values
- Simple to implement
- Fast compression and decompression
- Good for text files with repeated characters
- Not effective for data with few repeated values

## Learning Resources
1. [Wikipedia: Run-Length Encoding](https://en.wikipedia.org/wiki/Run-length_encoding)
2. [GeeksforGeeks: Run Length Encoding](https://www.geeksforgeeks.org/run-length-encoding/)
3. [TutorialsPoint: Data Compression - Run Length Encoding](https://www.tutorialspoint.com/data_compression/run_length_encoding.htm)
