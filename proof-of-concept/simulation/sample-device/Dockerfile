FROM node:16.9.1

COPY fogbed-requirements.txt .
RUN apt-get update \
    && cat fogbed-requirements.txt | DEBIAN_FRONTEND=noninteractive xargs apt-get install -y --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/tmp/*
RUN apt-get install -y vim
WORKDIR /app/sls-device/
COPY sls-sdk/ sls-sdk/
COPY sls-types/ sls-types/
COPY package.json .
COPY package-lock.json .
RUN mv sls-sdk/ ../../sls-sdk/ && mv sls-types/ ../../sls-types/
RUN npm install
COPY . .
RUN rm -rf sls-sdk/ sls-types/
RUN npm run build
RUN cd /sls-sdk/ && rm -rf test/ && node_modules/typescript/bin/tsc \
    && sed -i 's/"main":.*/"main": "build\/main.js",/g' package.json
WORKDIR /app/sls-device/build/scenarios/
