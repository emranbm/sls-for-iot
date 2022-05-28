#!/usr/bin/env bash

set -euo pipefail

readonly CWD="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

cd "$CWD"

rm -rf ./sls-sdk/ 2> /dev/null || true
rm -rf ./sls-types/ 2> /dev/null || true
cp -rf ../../sls-sdk/ ../../sls-types/ .
docker build -t sample-device .
