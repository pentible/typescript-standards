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
        # NOTE: would normally `shift` here, but in this case it's unreachable
    done
}

parse_cli_args "$@"

declare -a files=()
while IFS= read -r file; do
    files+=("$file")
done < <(git ls-files '*.sh')

shellcheck "${files[@]}"
