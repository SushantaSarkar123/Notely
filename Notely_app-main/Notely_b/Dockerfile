# Backend Dockerfile for Express.js
FROM node:lts
# FROM node:latest

WORKDIR /app
COPY package*.json ./
# RUN npm ci --omit=dev
RUN npm install 
# RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
