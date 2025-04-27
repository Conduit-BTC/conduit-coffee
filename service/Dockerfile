# First stage: Build environment
FROM node:23-slim AS builder

WORKDIR /service

# Copy and install all deps (including devDependencies)
COPY package*.json ./
RUN yarn install --production=false

# Copy app code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Second stage: Slim production image
FROM node:23-slim

WORKDIR /service

# Only copy prod deps
COPY package*.json ./
RUN yarn install --production=true

# Copy generated code (and app source)
COPY --from=builder /service .

# Make startup script executable
RUN chmod +x startup.sh

# Expose the API port
EXPOSE 3456

# Use the startup script as the entry point
CMD ["./startup.sh"]
