#!/usr/bin/env bash

# verify that the package-lock.json is up to date with the package.json

set -e

declare script_dir
script_dir="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"

# NOTE: we wrap the script because `npm i` won't link it on the first install
# (since the file doesn't exist yet)
exec node "${script_dir}/dist/index.js" "$@"
