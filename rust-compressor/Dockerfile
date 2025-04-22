FROM rust:1.79-slim-bookworm AS builder

WORKDIR /usr/src/app

RUN apt-get update

RUN apt-get install -y --no-install-recommends musl-tools build-essential && \
   
    rm -rf /var/lib/apt/lists/*

RUN rustup target add x86_64-unknown-linux-musl

COPY . .

RUN cargo build --target x86_64-unknown-linux-musl --release --no-default-features --verbose

FROM scratch

COPY --from=builder /usr/src/app/target/x86_64-unknown-linux-musl/release/rust-compressor /rust-compressor

ENTRYPOINT ["/rust-compressor"] 