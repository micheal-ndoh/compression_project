FROM node:latest

WORKDIR /usr/src/js-compressor

COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force


COPY index.js ./
COPY rle.js ./
COPY lz.js ./




ENTRYPOINT ["node", "index.js"] 