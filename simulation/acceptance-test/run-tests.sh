#!/usr/bin/env bash

set -euo pipefail

readonly CWD="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

docker-compose down
docker-compose up -d
cd "$CWD"
BROKER_URL=mqtt://localhost:1883 ./node_modules/mocha/bin/mocha
