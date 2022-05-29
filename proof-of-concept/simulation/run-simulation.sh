#!/usr/bin/env bash

set -euo pipefail

readonly CWD="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
readonly SIMULATION_CASE=$1
readonly SIMULATION_CASE_FILE_PATH="$CWD/cases/$SIMULATION_CASE.py"

test -f "$SIMULATION_CASE_FILE_PATH" \
|| ( echo -e "The corresponding simulation file not exists!\n Expected to be found at: $SIMULATION_CASE_FILE_PATH" \
&& exit 1 )

docker run \
    --rm \
    --privileged \
    --pid='host' \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$SIMULATION_CASE_FILE_PATH":/case.py \
    fogbed/fogbed \
    python /case.py
