# First stage: Build environment
FROM node:18-slim AS builder

# Install system dependencies Prisma needs
RUN apt-get update -y && apt-get install -y openssl libssl-dev

WORKDIR /service

# Copy and install all deps (including devDependencies)
COPY package*.json ./
RUN yarn install --production=false

# Copy app code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Second stage: Slim production image
FROM  node:18-slim

RUN apt-get update -y && apt-get install -y openssl libssl-dev

WORKDIR /service

# Only copy prod deps
COPY package*.json ./
RUN yarn install

# Copy generated code (and app source)
COPY --from=builder /service .

# Make startup script executable
RUN chmod +x startup.sh

# Expose the API port
EXPOSE 3456

# Use the startup script as the entry point
CMD ["./startup.sh"]
