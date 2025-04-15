FROM node:latest

WORKDIR /usr/src/js-compressor

COPY package*.json ./

RUN npm install

COPY index.js ./
COPY rle.js ./
COPY lz.js ./
COPY file-type.js ./

ENTRYPOINT ["node", "index.js"] 