#!/usr/bin/env bash
# This script builds the image of services defined in the docker-compose.yml

set -euo pipefail

readonly CWD="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

cd "$CWD"
cp -rf sls-types/ sls-shared-utils/ sls-manager/
docker-compose build
cd sls-manager/
rm -rf sls-types/ sls-shared-utils/
