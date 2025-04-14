FROM node:latest

WORKDIR /app


COPY package*.json ./
RUN npm ci --only=production


COPY index.js ./
COPY rle.js ./
COPY lz.js ./


RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENTRYPOINT ["node", "index.js"] 