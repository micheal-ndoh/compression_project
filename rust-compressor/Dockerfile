# Use an official Rust runtime as a base image
FROM rust:1.77-slim-bookworm AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the Cargo manifest files
COPY Cargo.toml Cargo.lock ./

# Copy the source code
COPY src ./src

# Build the application in release mode without default features
RUN cargo build --release --no-default-features

# Create a minimal runtime image
FROM debian:bookworm-slim

# Install necessary runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /usr/src/app/target/release/rust-compressor /app/

# Make the binary executable
RUN chmod +x /app/rust-compressor

# Set the entrypoint to run the binary
ENTRYPOINT ["/app/rust-compressor"]

# Default command to show help
CMD ["--help"] 