# Use Rust as the base image
FROM rust:1.70-slim as builder

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Build the application
RUN cargo build --release

# Use a minimal image for the final stage
FROM debian:bullseye-slim

# Copy the binary from the builder stage
COPY --from=builder /app/target/release/rust-compressor /usr/local/bin/

# Set the entry point
ENTRYPOINT ["rust-compressor"] 