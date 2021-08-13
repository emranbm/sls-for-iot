FROM node:16.6.1-alpine3.13
WORKDIR /app/
COPY package.json .
COPY package-lock.json .
COPY sls-types/ ../sls-types
RUN npm install
COPY . .
RUN rm -rf sls-types/
RUN npm run build
CMD sh update-config.sh && node build/main.js
