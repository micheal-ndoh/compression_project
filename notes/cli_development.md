# CLI Development in Rust and JavaScript

## Command Line Interface (CLI) Basics

A CLI is a text-based interface where users interact with a program by typing commands. In this project, we'll create a CLI tool that supports compression and decompression operations.

## Rust CLI Development

### Using clap for Argument Parsing

```rust
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(author, version, about)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Compress a file
    Compress {
        input: String,
        output: String,
        #[arg(short, long)]
        rle: bool,
        #[arg(short, long)]
        lz: bool,
    },
    /// Decompress a file
    Decompress {
        input: String,
        output: String,
        #[arg(short, long)]
        rle: bool,
        #[arg(short, long)]
        lz: bool,
    },
}

fn main() {
    let cli = Cli::parse();
    match cli.command {
        Commands::Compress { input, output, rle, lz } => {
            // Handle compression
        }
        Commands::Decompress { input, output, rle, lz } => {
            // Handle decompression
        }
    }
}
```

## JavaScript CLI Development

### Using process.argv

```javascript
const args = process.argv.slice(2);

function parseArgs() {
    const command = args[0];
    const input = args[1];
    const output = args[2];
    const algorithm = args[3]; // --rle or --lz

    return { command, input, output, algorithm };
}

// Example usage
const { command, input, output, algorithm } = parseArgs();

if (command === 'compress') {
    // Handle compression
} else if (command === 'decompress') {
    // Handle decompression
}
```

## Common CLI Features

1. **Help Messages**: Display usage instructions
2. **Error Handling**: Validate inputs and show helpful error messages
3. **Progress Indicators**: Show compression/decompression progress
4. **Exit Codes**: Return appropriate exit codes for success/failure

## Resources for Learning More

1. [Rust CLI Book](https://rust-cli.github.io/book/index.html)
2. [clap Documentation](https://docs.rs/clap/latest/clap/)
3. [Node.js process.argv](https://nodejs.org/docs/latest/api/process.html#processargv)
4. [Commander.js](https://github.com/tj/commander.js) (Alternative to process.argv)
