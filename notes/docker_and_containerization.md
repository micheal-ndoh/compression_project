# Docker and Containerization

## What is Docker?

Docker is a platform that allows you to package applications and their dependencies into isolated containers. These containers are lightweight, portable, and can run consistently across different environments.

## Key Concepts

1. **Container**: A lightweight, standalone, executable package that includes everything needed to run an application
2. **Image**: A read-only template used to create containers
3. **Dockerfile**: A text file containing instructions for building a Docker image
4. **Registry**: A storage and distribution system for Docker images (like GitHub Container Registry - GHCR)

## Dockerfile Basics

A typical Dockerfile contains:

```dockerfile
# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy files
COPY package.json .
COPY index.js .

# Install dependencies
RUN npm install

# Command to run
CMD ["node", "index.js"]
```

## Use in the Project

In this project, we'll create two Docker images:

1. **Rust Compressor**: For the Rust implementation
2. **JavaScript Compressor**: For the Node.js implementation

Each will have its own Dockerfile and will be published to GitHub Container Registry.

## Docker Commands

```bash
# Build an image
docker build -t my-image .

# Run a container
docker run my-image

# Push to registry
docker push ghcr.io/username/repo:tag
```

## Resources for Learning More

1. [Docker Documentation](https://docs.docker.com/)
2. [Docker Tutorial for Beginners](https://www.youtube.com/watch?v=fqMOX6JJhGo)
3. [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
4. [GitHub Container Registry Documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
