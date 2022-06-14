#!/usr/bin/env bash

# run shellcheck on all *.sh files

set -e

usage() {
    echo 'usage: shellcheck-all'
}

parse_cli_args() {
    while [[ "$#" -gt 0 ]]; do
        case "$1" in
            -h | --help)
                usage
                exit 0
                ;;
            *)
                echo "shellcheck-all: unrecognized option $1" 1>&2
                usage 1>&2
                return 1
                ;;
        esac
        shift
    done
}

parse_cli_args "$@"

git ls-files '*.sh' -z | xargs -0 --no-run-if-empty shellcheck
