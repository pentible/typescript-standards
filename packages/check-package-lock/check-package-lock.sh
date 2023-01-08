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
        # NOTE: would normally `shift` here, but in this case it's unreachable
    done
}

is_monorepo() {
    node "${script_dir}/is-monorepo.cjs"
}

find_conflicting_packages() {
    node "${script_dir}/find-conflicting-packages.cjs"
}

find_missing_workspaces() {
    node "${script_dir}/find-missing-workspaces.cjs"
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

if is_monorepo; then
    # ensure no conflicting packages in monorepo
    declare conflicting_packages
    conflicting_packages="$(find_conflicting_packages)"
    if [[ -n "$conflicting_packages" ]]; then
        echo 'Conflicting package versions detected:'
        echo "$conflicting_packages"
        exit 1
    fi

    # ensure no missing workspaces
    declare missing_workspaces
    missing_workspaces="$(find_missing_workspaces)"
    if [[ -n "$missing_workspaces" ]]; then
        echo 'Missing workspaces detected:'
        echo "$missing_workspaces"
        exit 1
    fi
fi
