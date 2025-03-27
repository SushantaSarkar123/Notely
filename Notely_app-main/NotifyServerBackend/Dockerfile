FROM node:current-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
# RUN npm install    # Installs node-cron and other dependencies
COPY . .
CMD ["npm", "run", "dev"]

