# Use a Node.js base image
FROM node:18-slim

# Set the working directory to the root of your project
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the React app
RUN npm run build

# Set the environment to production
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
