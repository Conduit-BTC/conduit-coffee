# Use the official Node.js image as the base
FROM node:23-slim

# Set the working directory
WORKDIR /service

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Generate Prisma client and migrate the database
RUN prisma generate

# Make startup script executable
RUN chmod +x startup.sh

# Expose the API port
EXPOSE 3456

# Use the startup script as the entry point
CMD ["./startup.sh"]
