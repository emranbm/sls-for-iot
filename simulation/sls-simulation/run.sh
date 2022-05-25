#!/usr/bin/env bash

set -euo pipefail

readonly CWD="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

docker run \
    --rm \
    --privileged \
    --pid='host' \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$CWD/main.py":/main.py \
    fogbed/fogbed \
    python /main.py
    # python /fogbed/examples/virtual_instance_example.py
