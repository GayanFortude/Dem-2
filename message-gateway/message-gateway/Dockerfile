# Use official Node.js runtime as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port your app runs on (default NestJS port is 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]