use anyhow::Result;
use clap::{Parser, Subcommand};
use std::fs;
use std::io::{self, Read, Write};
use std::path::Path;

mod file_type;
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
    /// Compress a file or stdin
    Compress {
        /// Input file path (use - for stdin, or glob pattern for multiple files)
        input: String,
        /// Output file path (use - for stdout, or directory for multiple files)
        output: String,
        /// Compression algorithm to use (auto for automatic selection)
        #[arg(short, long, default_value = "auto")]
        algorithm: String,
    },
    /// Decompress a file or stdin
    Decompress {
        /// Input file path (use - for stdin, or glob pattern for multiple files)
        input: String,
        /// Output file path (use - for stdout, or directory for multiple files)
        output: String,
        /// Compression algorithm to use
        #[arg(short, long, default_value = "rle")]
        algorithm: String,
    },
}

fn read_input(input: &str) -> Result<Vec<u8>> {
    if input == "-" {
        let mut buffer = Vec::new();
        io::stdin().read_to_end(&mut buffer)?;
        Ok(buffer)
    } else {
        Ok(std::fs::read(input)?)
    }
}

fn write_output(output: &str, data: &[u8]) -> Result<()> {
    if output == "-" {
        io::stdout().write_all(data)?;
        Ok(())
    } else {
        Ok(std::fs::write(output, data)?)
    }
}

fn process_multiple_files(
    input_pattern: &str,
    output_dir: &str,
    algorithm: &str,
    is_compression: bool,
) -> Result<()> {
    let paths = glob::glob(input_pattern)?;
    fs::create_dir_all(output_dir)?;

    for path in paths {
        let input_path = path?;
        let input_path_str = input_path.to_str().unwrap();
        let output_path = Path::new(output_dir).join(input_path.file_name().unwrap());

        let data = read_input(input_path_str)?;
        let result = if is_compression {
            let selected_algorithm = if algorithm == "auto" {
                let mime_type = file_type::detect_file_type(input_path_str)?;
                file_type::suggest_algorithm(&mime_type)
            } else {
                algorithm
            };

            match selected_algorithm {
                "rle" => rle::compress_rle(&data),
                "lz77" => lz77::compress_lz77(&data),
                _ => anyhow::bail!("Invalid algorithm specified. Use either 'rle' or 'lz77'"),
            }
        } else {
            match algorithm {
                "rle" => rle::decompress_rle(&data),
                "lz77" => lz77::decompress_lz77(&data),
                _ => anyhow::bail!("Invalid algorithm specified. Use either 'rle' or 'lz77'"),
            }
        };

        write_output(output_path.to_str().unwrap(), &result)?;
        println!(
            "Processed {} using {} algorithm",
            input_path_str,
            if is_compression {
                algorithm
            } else {
                "decompression"
            }
        );
    }

    Ok(())
}

fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Compress {
            input,
            output,
            algorithm,
        } => {
            if input.contains('*') || input.contains('?') {
                process_multiple_files(&input, &output, &algorithm, true)?;
            } else {
                let data = read_input(&input)?;
                let selected_algorithm = if algorithm == "auto" {
                    if input == "-" {
                        "rle" // Default to RLE for stdin
                    } else {
                        let mime_type = file_type::detect_file_type(&input)?;
                        file_type::suggest_algorithm(&mime_type)
                    }
                } else {
                    &algorithm
                };

                let compressed = match selected_algorithm {
                    "rle" => rle::compress_rle(&data),
                    "lz77" => lz77::compress_lz77(&data),
                    _ => anyhow::bail!("Invalid algorithm specified. Use either 'rle' or 'lz77'"),
                };
                write_output(&output, &compressed)?;
                if output != "-" {
                    println!(
                        "File compressed successfully using {} algorithm",
                        selected_algorithm
                    );
                }
            }
        }
        Commands::Decompress {
            input,
            output,
            algorithm,
        } => {
            if input.contains('*') || input.contains('?') {
                process_multiple_files(&input, &output, &algorithm, false)?;
            } else {
                let data = read_input(&input)?;
                let decompressed = match algorithm.as_str() {
                    "rle" => rle::decompress_rle(&data),
                    "lz77" => lz77::decompress_lz77(&data),
                    _ => anyhow::bail!("Invalid algorithm specified. Use either 'rle' or 'lz77'"),
                };
                write_output(&output, &decompressed)?;
                if output != "-" {
                    println!(
                        "File decompressed successfully using {} algorithm",
                        algorithm
                    );
                }
            }
        }
    }

    Ok(())
}
