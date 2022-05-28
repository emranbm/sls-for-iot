FROM node:16.9.1

COPY fogbed-requirements.txt .
RUN apt-get update \
    && cat fogbed-requirements.txt | DEBIAN_FRONTEND=noninteractive xargs apt-get install -y --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/tmp/*
WORKDIR /app/sls-device/
COPY . .
RUN mv sls-sdk/ ../../sls-sdk/ && mv sls-types/ ../../sls-types/
RUN npm install
RUN npm run build
WORKDIR /app/sls-device/build/scenarios/
ENTRYPOINT [ "/usr/local/bin/node" ]
