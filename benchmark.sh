#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to convert bytes to human readable format
human_readable_size() {
    local bytes=$1
    if [ $bytes -lt 1024 ]; then
        echo "${bytes} B"
    elif [ $bytes -lt 1048576 ]; then
        echo "$(bc <<< "scale=2; $bytes/1024") KB"
    elif [ $bytes -lt 1073741824 ]; then
        echo "$(bc <<< "scale=2; $bytes/1048576") MB"
    else
        echo "$(bc <<< "scale=2; $bytes/1073741824") GB"
    fi
}

# Function to calculate compression ratio
get_compression_ratio() {
    local original_size=$1
    local compressed_size=$2
    echo "$(bc <<< "scale=2; ($compressed_size * 100) / $original_size")%"
}

# Check if input file is provided
if [ $# -ne 1 ]; then
    echo -e "${RED}Usage: $0 <input_file>${NC}"
    echo "Example: $0 myfile.txt"
    exit 1
fi

# Define input and output file paths
INPUT_FILE="$1"
FILENAME=$(basename "$INPUT_FILE")
BASENAME="${FILENAME%.*}"

# JavaScript paths
COMPRESSED_FILE_JS_RLE="js-compressor/compressed/${BASENAME}.rle"
DECOMPRESSED_FILE_JS_RLE="js-compressor/decompressed/${BASENAME}_rle.out"
COMPRESSED_FILE_JS_LZ="js-compressor/compressed/${BASENAME}.lz"
DECOMPRESSED_FILE_JS_LZ="js-compressor/decompressed/${BASENAME}_lz.out"

# Rust paths
COMPRESSED_FILE_RUST_RLE="rust-compressor/compressed/${BASENAME}.rle"
DECOMPRESSED_FILE_RUST_RLE="rust-compressor/decompressed/${BASENAME}_rle.out"
COMPRESSED_FILE_RUST_LZ="rust-compressor/compressed/${BASENAME}.lz"
DECOMPRESSED_FILE_RUST_LZ="rust-compressor/decompressed/${BASENAME}_lz.out"

# File path for reporting
REPORT_FILE="benchmark_report_${BASENAME}.md"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo -e "${RED}Error: Input file '$INPUT_FILE' does not exist${NC}"
    exit 1
fi

# Get original file size
ORIGINAL_SIZE=$(wc -c < "$INPUT_FILE")
READABLE_SIZE=$(human_readable_size $ORIGINAL_SIZE)

# Create directories
mkdir -p js-compressor/compressed js-compressor/decompressed
mkdir -p rust-compressor/compressed rust-compressor/decompressed

# Create the report file and start writing
echo "# Compression Benchmark Report" > $REPORT_FILE
echo "## File Information" >> $REPORT_FILE
echo "- **Input File:** \`$FILENAME\`" >> $REPORT_FILE
echo "- **Original Size:** $READABLE_SIZE" >> $REPORT_FILE
echo "" >> $REPORT_FILE
echo "## Benchmark Results" >> $REPORT_FILE
echo "| Implementation | Algorithm | Compression |  Compressed Size  | Ratio | Decompression | Status |" >> $REPORT_FILE
echo "|---------------|-----------|-------------|------------------|--------|---------------|---------|" >> $REPORT_FILE

benchmark_js() {
    local algo=$1
    local compressed_file_var="COMPRESSED_FILE_JS_${algo^^}"
    local decompressed_file_var="DECOMPRESSED_FILE_JS_${algo^^}"

    echo -e "${GREEN}Benchmarking JavaScript Compression with ${algo^^}...${NC}"

    # Compression
    local start_time=$(date +%s.%N)
    docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/js-compressor:latest compress "/data/$INPUT_FILE" "/data/${!compressed_file_var}" --algorithm "$algo"
    local end_time=$(date +%s.%N)
    local compress_time=$(printf "%.2f s" $(echo "$end_time - $start_time" | bc))

    # Decompression
    start_time=$(date +%s.%N)
    docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/js-compressor:latest decompress "/data/${!compressed_file_var}" "/data/${!decompressed_file_var}" --algorithm "$algo"
    end_time=$(date +%s.%N)
    local decompress_time=$(printf "%.2f s" $(echo "$end_time - $start_time" | bc))

    # Get file sizes and status
    local compressed_size=0
    local status="❌ Failed"
    if [ -f "${!compressed_file_var}" ]; then
        compressed_size=$(wc -c < "${!compressed_file_var}")
        local readable_compressed=$(human_readable_size $compressed_size)
        local ratio=$(get_compression_ratio $ORIGINAL_SIZE $compressed_size)
        
        if [ -f "${!decompressed_file_var}" ]; then
            if cmp -s "$INPUT_FILE" "${!decompressed_file_var}"; then
                status="✅ Success"
            fi
        fi
        
        echo "| JavaScript | ${algo^^} | $compress_time | $readable_compressed | $ratio | $decompress_time | $status |" >> "$REPORT_FILE"
    else
        echo "| JavaScript | ${algo^^} | $compress_time | Failed | - | $decompress_time | $status |" >> "$REPORT_FILE"
    fi
}

benchmark_rust() {
    local algo=$1
    local compressed_file_var="COMPRESSED_FILE_RUST_${algo^^}"
    local decompressed_file_var="DECOMPRESSED_FILE_RUST_${algo^^}"

    echo -e "${GREEN}Benchmarking Rust Compression with ${algo^^}...${NC}"

    # Compression
    local start_time=$(date +%s.%N)
    docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/rust-compressor:latest compress "/data/$INPUT_FILE" "/data/${!compressed_file_var}" --algorithm "$algo"
    local end_time=$(date +%s.%N)
    local compress_time=$(printf "%.2f s" $(echo "$end_time - $start_time" | bc))

    # Decompression
    start_time=$(date +%s.%N)
    docker run --rm -v "$(pwd):/data" ghcr.io/micheal-ndoh/rust-compressor:latest decompress "/data/${!compressed_file_var}" "/data/${!decompressed_file_var}" --algorithm "$algo"
    end_time=$(date +%s.%N)
    local decompress_time=$(printf "%.2f s" $(echo "$end_time - $start_time" | bc))

    # Get file sizes and status
    local compressed_size=0
    local status="❌ Failed"
    if [ -f "${!compressed_file_var}" ]; then
        compressed_size=$(wc -c < "${!compressed_file_var}")
        local readable_compressed=$(human_readable_size $compressed_size)
        local ratio=$(get_compression_ratio $ORIGINAL_SIZE $compressed_size)
        
        if [ -f "${!decompressed_file_var}" ]; then
            if cmp -s "$INPUT_FILE" "${!decompressed_file_var}"; then
                status="✅ Success"
            fi
        fi
        
        echo "| Rust | ${algo^^} | $compress_time | $readable_compressed | $ratio | $decompress_time | $status |" >> "$REPORT_FILE"
    else
        echo "| Rust | ${algo^^} | $compress_time | Failed | - | $decompress_time | $status |" >> "$REPORT_FILE"
    fi
}

# Run benchmarks
echo -e "${YELLOW}Starting benchmarks...${NC}"
benchmark_js rle
benchmark_rust rle
benchmark_js lz
benchmark_rust lz

# Add summary section
echo "" >> $REPORT_FILE
echo "## Summary" >> $REPORT_FILE
echo "- Compression time includes reading the input file and writing the compressed output" >> $REPORT_FILE
echo "- Decompression time includes reading the compressed file and writing the decompressed output" >> $REPORT_FILE
echo "- Ratio shows compressed size as a percentage of the original size" >> $REPORT_FILE
echo "- Status indicates whether the decompressed file matches the original exactly" >> $REPORT_FILE

echo -e "${GREEN}Benchmarking complete!${NC}"
echo -e "${YELLOW}Results have been written to: $REPORT_FILE${NC}" 