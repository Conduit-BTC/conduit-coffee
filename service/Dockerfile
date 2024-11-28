# Use the official Node.js image as the base
FROM node:18

# Set the working directory
WORKDIR /service

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the API port
EXPOSE 3456

# Copy the Prisma schema
COPY prisma ./prisma/

# Generate Prisma client and migrate the database
RUN npx prisma generate && npx prisma migrate dev --name init

# Start the API server
CMD ["npm", "start"]
