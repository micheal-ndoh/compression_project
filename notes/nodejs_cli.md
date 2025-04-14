# Node.js CLI Development

## What is a CLI?
A Command Line Interface (CLI) is a text-based interface for interacting with software. In this project, we'll create a CLI tool that allows users to compress and decompress files using different algorithms.

## Key Components of a Node.js CLI

### 1. Command Line Arguments
Node.js provides the `process.argv` array to access command line arguments. However, we'll use a more powerful library called `commander` to handle arguments in a more structured way.

### 2. File System Operations
Node.js's `fs` module provides functions for reading and writing files. We'll use:
- `fs.readFileSync()` / `fs.readFile()` for reading files
- `fs.writeFileSync()` / `fs.writeFile()` for writing files

### 3. Error Handling
Proper error handling is crucial for CLI tools. We'll use:
- Try/catch blocks
- Process exit codes
- User-friendly error messages

## Implementation in This Project
Our CLI will support the following commands:
```bash
compress <input> <output> --algorithm <algorithm>
decompress <input> <output> --algorithm <algorithm>
```

## Code Example
Here's a basic structure for our CLI:

```javascript
#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const { compressRLE, decompressRLE } = require('./rle');
const { compressLZ77, decompressLZ77 } = require('./lz77');

program
    .name('compression-tool')
    .description('A tool for compressing and decompressing files')
    .version('1.0.0');

program
    .command('compress')
    .description('Compress a file')
    .argument('<input>', 'input file path')
    .argument('<output>', 'output file path')
    .option('-a, --algorithm <algorithm>', 'compression algorithm (rle or lz77)', 'rle')
    .action((input, output, options) => {
        try {
            const data = fs.readFileSync(input);
            let compressed;
            
            if (options.algorithm === 'rle') {
                compressed = compressRLE(data);
            } else if (options.algorithm === 'lz77') {
                compressed = compressLZ77(data);
            } else {
                throw new Error('Invalid algorithm specified');
            }
            
            fs.writeFileSync(output, compressed);
            console.log('Compression completed successfully');
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });

program
    .command('decompress')
    .description('Decompress a file')
    .argument('<input>', 'input file path')
    .argument('<output>', 'output file path')
    .option('-a, --algorithm <algorithm>', 'compression algorithm (rle or lz77)', 'rle')
    .action((input, output, options) => {
        try {
            const data = fs.readFileSync(input);
            let decompressed;
            
            if (options.algorithm === 'rle') {
                decompressed = decompressRLE(data);
            } else if (options.algorithm === 'lz77') {
                decompressed = decompressLZ77(data);
            } else {
                throw new Error('Invalid algorithm specified');
            }
            
            fs.writeFileSync(output, decompressed);
            console.log('Decompression completed successfully');
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });

program.parse();
```

## Best Practices
1. **User Experience**:
   - Provide clear error messages
   - Show progress indicators for long operations
   - Include helpful documentation

2. **Error Handling**:
   - Validate input parameters
   - Handle file system errors gracefully
   - Use appropriate exit codes

3. **Code Organization**:
   - Separate concerns (compression logic, CLI interface, file operations)
   - Use modules for different components
   - Write tests for each component

## Learning Resources
1. [Node.js Documentation: Command Line Options](https://nodejs.org/api/cli.html)
2. [Commander.js Documentation](https://github.com/tj/commander.js)
3. [Node.js fs Module Documentation](https://nodejs.org/api/fs.html)
4. [Building Command Line Tools with Node.js](https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs) 