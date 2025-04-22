FROM node:20-slim

WORKDIR /usr/src/js-compressor

COPY package*.json ./

RUN npm ci --only=production

COPY index.js ./
COPY rle.js ./
COPY lz.js ./
COPY file-type.js ./

RUN useradd -r -u 1001 -g root compressor
USER compressor

ENTRYPOINT ["node", "index.js"] 