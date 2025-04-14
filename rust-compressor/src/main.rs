use anyhow::Result;
use clap::{Parser, Subcommand};

mod lz77;
mod rle;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Compress a file
    Compress {
        /// Input file path
        input: String,
        /// Output file path
        output: String,
        /// Compression algorithm to use
        #[arg(short, long, default_value = "rle")]
        algorithm: String,
    },
    /// Decompress a file
    Decompress {
        /// Input file path
        input: String,
        /// Output file path
        output: String,
        /// Compression algorithm to use
        #[arg(short, long, default_value = "rle")]
        algorithm: String,
    },
}

fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Compress {
            input,
            output,
            algorithm,
        } => {
            match algorithm.as_str() {
                "rle" => rle::compress_file_rle(&input, &output)?,
                "lz77" => lz77::compress_file_lz77(&input, &output)?,
                _ => anyhow::bail!("Invalid algorithm specified. Use either 'rle' or 'lz77'"),
            }
            println!("File compressed successfully using {} algorithm", algorithm);
        }
        Commands::Decompress {
            input,
            output,
            algorithm,
        } => {
            match algorithm.as_str() {
                "rle" => rle::decompress_file_rle(&input, &output)?,
                "lz77" => lz77::decompress_file_lz77(&input, &output)?,
                _ => anyhow::bail!("Invalid algorithm specified. Use either 'rle' or 'lz77'"),
            }
            println!(
                "File decompressed successfully using {} algorithm",
                algorithm
            );
        }
    }

    Ok(())
}
