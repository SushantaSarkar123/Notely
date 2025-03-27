# Frontend Dockerfile for React.js
# Stage 1: Build the React App
FROM node:lts AS build
WORKDIR /app
# Copy only package.json and package-lock.json to optimize caching
COPY package*.json ./
# Install dependencies (prefer npm ci for production consistency)
# RUN npm ci --omit=dev
RUN npm install 
# Copy the rest of the app and build
COPY . .
RUN npm run build
# Stage 2: Serve the app with NGINX
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# Expose port 80 for NGINX
EXPOSE 80
# Start NGINX
CMD ["nginx", "-g", "daemon off;"]


# # FROM node:lts
# FROM node:latest

# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# # RUN npm install
# COPY . .
# RUN npm run build
# FROM nginx:alpine
# COPY --from=0 /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
