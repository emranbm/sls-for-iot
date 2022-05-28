#!/usr/bin/env bash

set -euo pipefail

readonly CWD="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

cd "$CWD"
git clone https://github.com/fogbed/fogbed.git
mv -f fogbed/src .
rm -rf fogbed/
