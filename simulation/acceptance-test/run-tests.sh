#!/usr/bin/env bash

set -euo pipefail

readonly CWD="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BUILD=true

if [ ! -z ${1+x} ] && [ "$1" == "--ignore-build" ]; then
    BUILD=false
fi

if $BUILD; then
    cd "$CWD/../"
    ./docker-compose-build.sh
fi
docker-compose up -d
cd "$CWD"
BROKER_URL=mqtt://localhost:1883 ./node_modules/ts-mocha/bin/ts-mocha --exit --timeout 10000
