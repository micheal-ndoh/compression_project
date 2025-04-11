use clap::{Parser, Subcommand};
use std::fs;
use std::path::Path;

mod lz;
mod rle;

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
        Commands::Compress {
            input,
            output,
            rle,
            lz,
        } => {
            let data = fs::read(&input).expect("Failed to read input file");
            let compressed = if rle {
                rle::compress(&data)
            } else if lz {
                lz::compress(&data)
            } else {
                eprintln!("Please specify compression algorithm (--rle or --lz)");
                std::process::exit(1);
            };
            fs::write(&output, compressed).expect("Failed to write output file");
            println!("Compressed {} to {}", input, output);
        }
        Commands::Decompress {
            input,
            output,
            rle,
            lz,
        } => {
            let data = fs::read(&input).expect("Failed to read input file");
            let decompressed = if rle {
                rle::decompress(&data)
            } else if lz {
                lz::decompress(&data)
            } else {
                eprintln!("Please specify decompression algorithm (--rle or --lz)");
                std::process::exit(1);
            };
            fs::write(&output, decompressed).expect("Failed to write output file");
            println!("Decompressed {} to {}", input, output);
        }
    }
}
