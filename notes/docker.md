# Docker and Containerization

## What is Docker?
Docker is a platform for developing, shipping, and running applications in containers. Containers are lightweight, standalone, executable packages that include everything needed to run an application: code, runtime, system tools, system libraries, and settings.

## Why Use Docker?
1. **Consistency**: The same container will run the same way on any machine
2. **Isolation**: Containers run in isolated environments
3. **Portability**: Easy to move applications between environments
4. **Scalability**: Easy to scale applications up or down
5. **Version Control**: Track changes to container configurations

## Key Docker Concepts

### 1. Dockerfile
A text file that contains instructions for building a Docker image. It specifies:
- Base image to start from
- Dependencies to install
- Files to copy
- Commands to run

### 2. Docker Image
A read-only template used to create containers. Images are built from Dockerfiles and can be stored in registries (like Docker Hub).

### 3. Docker Container
A running instance of a Docker image. Containers are isolated from each other and from the host system.

## Implementation in This Project
We'll create a Dockerfile to containerize our compression tool. This will make it easy to run the tool in any environment.

## Example Dockerfile
```dockerfile
# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Make the script executable
RUN chmod +x compress.js

# Set the entry point
ENTRYPOINT ["node", "compress.js"]
```

## Building and Running the Container
```bash
# Build the image
docker build -t compression-tool .

# Run the container
docker run compression-tool compress input.txt output.txt --algorithm rle
```

## Best Practices
1. **Image Size**:
   - Use minimal base images (like Alpine Linux)
   - Clean up temporary files
   - Use multi-stage builds when possible

2. **Security**:
   - Don't run containers as root
   - Keep images updated
   - Scan for vulnerabilities

3. **Performance**:
   - Use .dockerignore to exclude unnecessary files
   - Leverage Docker's build cache
   - Optimize layer ordering

## Learning Resources
1. [Docker Documentation](https://docs.docker.com/)
2. [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
3. [Docker Hub](https://hub.docker.com/)
4. [Docker Tutorial for Beginners](https://www.docker.com/101-tutorial) 