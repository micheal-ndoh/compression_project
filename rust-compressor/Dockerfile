# Build stage
FROM rust:1.75-slim as builder

WORKDIR /usr/src/rust-compressor

# Copy only the files needed for building
COPY Cargo.toml Cargo.lock ./
COPY src/ ./src/

# Build the release binary
RUN cargo build --release

# Final stage
FROM debian:bullseye-slim

# Install only necessary runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy the binary from the builder stage
COPY --from=builder /usr/src/rust-compressor/target/release/rust-compressor /usr/local/bin/

# Create a non-root user
RUN useradd -r -u 1001 -g root compressor
USER compressor

ENTRYPOINT ["/usr/local/bin/rust-compressor"] 