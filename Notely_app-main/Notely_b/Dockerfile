# Backend Dockerfile for Express.js
FROM node:lts
# FROM node:latest

WORKDIR /app
COPY package*.json ./
RUN npm ci
# RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
