FROM node:18-alpine AS builder

WORKDIR /app

RUN apk update && apk add --no-cache python3 make g++ upx && rm -rf /var/cache/apk/*

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --verbose

COPY . .

RUN npx pkg . --targets node18-alpine-x64 --output /app/compress-js-alpine

FROM alpine:3.21 

WORKDIR /app

COPY --from=builder /app/compress-js-alpine .

ENTRYPOINT ["/app/compress-js-alpine"]
