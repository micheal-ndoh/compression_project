# Use an official Node.js runtime as a base image
FROM node:lts-bookworm-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if you have one)
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the application source code
COPY . .

# Set the entrypoint to execute your CLI script
ENTRYPOINT ["node", "index.js"]

# Default command to show help
CMD ["--help"] 