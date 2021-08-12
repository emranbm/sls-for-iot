FROM node:16.6.1-alpine3.13
WORKDIR /app/
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build
CMD sh update-config.sh && node build/main.js
