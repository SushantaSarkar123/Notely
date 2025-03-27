# FROM node:current-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# # RUN npm install    # Installs node-cron and other dependencies
# COPY . .
# CMD ["npm", "run", "dev"]

# Base image with Node.js on Alpine Linux for smaller image size
FROM node:current-alpine
# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json to optimize caching
COPY package*.json ./
# Install dependencies using npm ci (better for production)
# RUN npm ci --omit=dev
RUN npm ci --omit=dev
# RUN npm install 
# Copy the rest of the project files
COPY . .
# Expose the backend port (adjust if needed)
EXPOSE 5000
# Set environment variable to production
ENV NODE_ENV=production
# Command to run the backend server (Production)
CMD ["npm", "start"]
