FROM rust:latest

RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/rust-compressor

COPY Cargo.toml Cargo.lock ./


COPY src ./src/

RUN cargo build --release


ENTRYPOINT ["/usr/src/rust-compressor/target/release/rust-compressor"] 