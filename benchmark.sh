#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Define Docker command for Multipass
DOCKER_CMD="multipass exec packa -- sudo /usr/bin/docker"

# Get absolute path of current directory
CURRENT_DIR=$(pwd)

# First, copy the current directory to Multipass instance
echo -e "${YELLOW}Copying files to Multipass instance...${NC}"
multipass copy-files "$CURRENT_DIR" "packa:/home/ubuntu/compression-test/"

# Check if input filename is provided
if [ $# -ne 1 ]; then
    echo -e "${RED}Usage: $0 <input_file>${NC}"
    echo "Example: $0 test.txt"
    exit 1
fi

INPUT_FILE=$1
# Auto-generate compressed file name based on input file
COMPRESSED_FILE="${INPUT_FILE%.*}.compressed"
REPORT_FILE="compression_report.md"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo -e "${RED}Error: Input file '$INPUT_FILE' does not exist${NC}"
    exit 1
fi

# Create output directory if it doesn't exist
OUTPUT_DIR="compression_test_output"
mkdir -p "$OUTPUT_DIR"

# Function to measure compression time
measure_compression() {
    local impl=$1
    local algo=$2
    local input=$3
    local output=$4
    local start_time=$(date +%s.%N)
    
    if [ "$impl" == "js" ]; then
        # Use JavaScript Docker container
        $DOCKER_CMD run --rm -v "/home/ubuntu/compression-test:/data" ghcr.io/micheal-ndoh/js-compressor:latest compress "/data/$input" "/data/$output" --algorithm "$algo"
    elif [ "$impl" == "rs" ]; then
        # Use Rust Docker container
        $DOCKER_CMD run --rm -v "/home/ubuntu/compression-test:/data" ghcr.io/micheal-ndoh/rust-compressor:latest compress "/data/$input" "/data/$output" --algorithm "$algo"
    fi
    
    local end_time=$(date +%s.%N)
    echo "$end_time - $start_time" | bc
}

# Function to measure decompression time
measure_decompression() {
    local impl=$1
    local algo=$2
    local compressed=$3
    local decompressed=$4
    local start_time=$(date +%s.%N)
    
    if [ "$impl" == "js" ]; then
        # Use JavaScript Docker container
        $DOCKER_CMD run --rm -v "/home/ubuntu/compression-test:/data" ghcr.io/micheal-ndoh/js-compressor:latest decompress "/data/$compressed" "/data/$decompressed" --algorithm "$algo"
    elif [ "$impl" == "rs" ]; then
        # Use Rust Docker container
        $DOCKER_CMD run --rm -v "/home/ubuntu/compression-test:/data" ghcr.io/micheal-ndoh/rust-compressor:latest decompress "/data/$compressed" "/data/$decompressed" --algorithm "$algo"
    fi
    
    local end_time=$(date +%s.%N)
    echo "$end_time - $start_time" | bc
}

# Function to verify decompressed files match original
verify_decompression() {
    local input=$1
    local decompressed=$2
    
    if [ ! -f "$decompressed" ]; then
        echo "✗"
        return
    fi
    
    if diff "$input" "$decompressed" >/dev/null 2>&1; then
        echo "✓"
    else
        echo "✗"
    fi
}

# Function to get file size in human-readable format with percentage
get_file_size() {
    local file=$1
    local original_size=$2
    
    if [ ! -f "$file" ]; then
        echo "N/A"
        return
    fi
    
    # Get size in bytes
    local size_bytes=$(wc -c < "$file")
    
    # Convert to human readable format
    if [ $size_bytes -ge 1048576 ]; then
        size_hr=$(echo "scale=2; $size_bytes/1048576" | bc)
        unit="MiB"
    elif [ $size_bytes -ge 1024 ]; then
        size_hr=$(echo "scale=2; $size_bytes/1024" | bc)
        unit="KiB"
    else
        size_hr=$size_bytes
        unit="B"
    fi
    
    # Calculate percentage if original size is provided
    if [ -n "$original_size" ]; then
        local percentage=$(echo "scale=1; ($size_bytes * 100) / $original_size" | bc)
        echo "${size_hr}${unit} (${percentage}%)"
    else
        echo "${size_hr}${unit}"
    fi
}

# Create markdown report
echo "# Compression Performance Comparison Report" > $REPORT_FILE
echo -e "\n## Test Configuration" >> $REPORT_FILE
echo "- Input File: $INPUT_FILE" >> $REPORT_FILE
original_size_bytes=$(wc -c < "$INPUT_FILE")
original_size=$(get_file_size "$INPUT_FILE")
echo "- Input Size: $original_size" >> $REPORT_FILE

echo -e "\n## Test Results\n" >> $REPORT_FILE
echo "| Algorithm | Implementation | Comp Time (s) | Decomp Time (s) | Comp Size | Verify |" >> $REPORT_FILE
echo "|-----------|----------------|---------------|-----------------|-----------|---------|" >> $REPORT_FILE

echo -e "${YELLOW}Testing $INPUT_FILE...${NC}"

# Test all combinations
for algo in "rle" "lz77"; do
    for impl in "js" "rs"; do
        echo -e "${GREEN}Testing $impl $algo...${NC}"
        
        # Create filenames with output directory
        COMPRESSED="$OUTPUT_DIR/${COMPRESSED_FILE}.${impl}.${algo}"
        DECOMPRESSED="$OUTPUT_DIR/${COMPRESSED_FILE}.${impl}.${algo}.decompressed"
        
        # Measure compression
        comp_time=$(measure_compression "$impl" "$algo" "$INPUT_FILE" "$COMPRESSED")
        
        # Get compressed size with percentage (after compression, before decompression)
        comp_size=$(get_file_size "$COMPRESSED" "$original_size_bytes")
        
        # Measure decompression
        decomp_time=$(measure_decompression "$impl" "$algo" "$COMPRESSED" "$DECOMPRESSED")
        
        # Verify decompression
        verify=$(verify_decompression "$INPUT_FILE" "$DECOMPRESSED")
        
        # Format times to 3 decimal places
        comp_time=$(printf "%.3f" $comp_time)
        decomp_time=$(printf "%.3f" $decomp_time)
        
        # Add to report
        echo "| $algo | $impl | $comp_time | $decomp_time | $comp_size | $verify |" >> $REPORT_FILE
    done
done

# Add summary section
echo -e "\n## Summary\n" >> $REPORT_FILE
echo "This report compares the performance of different compression algorithms and implementations." >> $REPORT_FILE
echo "- Algorithms: RLE (Run-Length Encoding) and LZ77 (Lempel-Ziv)" >> $REPORT_FILE
echo "- Implementations: JavaScript (Node.js) and Rust" >> $REPORT_FILE
echo "- Compression Time: Time taken to compress the input file (in seconds)" >> $REPORT_FILE
echo "- Decompression Time: Time taken to restore the original file (in seconds)" >> $REPORT_FILE
echo "- Compressed Size: Size of the compressed output file (and percentage of original)" >> $REPORT_FILE
echo "- Verification: Checks if the decompressed file matches the original (✓ = success, ✗ = failure)" >> $REPORT_FILE

# Copy back the results from Multipass
echo -e "${YELLOW}Copying results back from Multipass instance...${NC}"
multipass copy-files "packa:/home/ubuntu/compression-test/$OUTPUT_DIR" "$CURRENT_DIR/"
multipass copy-files "packa:/home/ubuntu/compression-test/$REPORT_FILE" "$CURRENT_DIR/"

echo -e "\n${GREEN}Report generated: $REPORT_FILE${NC}"
echo -e "${YELLOW}To view the report, run: cat $REPORT_FILE${NC}"
echo -e "${YELLOW}Compressed and decompressed files are in the '$OUTPUT_DIR' directory${NC}" 