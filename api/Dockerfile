# Use the official Node.js image as the base
FROM node:18

# Set the working directory
WORKDIR /api

RUN npm install -g pm2

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

# Generate Prisma client
RUN npx prisma generate

# Start the API server
CMD ["pm2-runtime", "start", "npm", "--", "start"]
