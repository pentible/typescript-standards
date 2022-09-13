#!/usr/bin/env bash

# verify that the package-lock.json is up to date with the package.json

set -e

declare script_dir
script_dir="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"

usage() {
    echo 'usage: check-package-lock [-h|--help]'
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

is_monorepo() {
    node "${script_dir}/is-monorepo.cjs"
}

find_conflicting_packages() {
    node "${script_dir}/find-conflicting-packages.cjs"
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

# ensure packages in sync with lock
quiet npm "${args[@]}" ls --package-lock-only

# ensure no conflicting packages in monorepo
if is_monorepo; then
    declare conflicting_packages
    conflicting_packages="$(find_conflicting_packages)"
    if [[ -n "$conflicting_packages" ]]; then
        echo 'Conflicting package versions detected:'
        echo "$conflicting_packages"
        exit 1
    fi
fi
