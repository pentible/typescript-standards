#!/usr/bin/env bash

# verify that the package-lock.json is up to date with the package.json

set -e

usage() {
    echo 'usage: check-package-lock'
}

parse_cli_args() {
    while [[ "$#" -gt 0 ]]; do
        case "$1" in
            -h | --help)
                usage
                exit 0
                ;;
            *)
                echo "check-package-lock: unrecognized option $1" 1>&2
                usage 1>&2
                return 1
                ;;
        esac
        shift
    done
}

quiet() {
    # only display command output if the command fails

    declare output

    if ! output="$("$@" 2>&1)"; then
        cat <<< "$output" >&2
        return 1
    fi
}

parse_cli_args "$@"

declare -a args=()
if [[ -t 1 ]]; then
    args+=('--color=always')
fi

quiet npm "${args[@]}" ls --package-lock-only
