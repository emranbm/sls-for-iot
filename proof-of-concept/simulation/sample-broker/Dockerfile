FROM ubuntu:20.04
COPY fogbed-requirements.txt .
RUN apt-get update \
    && cat fogbed-requirements.txt | DEBIAN_FRONTEND=noninteractive xargs apt-get install -y --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/tmp/*
RUN apt-add-repository ppa:mosquitto-dev/mosquitto-ppa
RUN apt-get update && apt-get install -y mosquitto mosquitto-clients && apt-get clean
COPY mosquitto-no-auth.conf /
