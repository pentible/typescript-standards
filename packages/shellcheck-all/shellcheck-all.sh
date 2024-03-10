#!/usr/bin/env bash

# run shellcheck on all *.sh and #! shell files

set -e

usage() {
    echo 'usage: shellcheck-all [<shellcheck-options>...] [<file>...]'
    echo '       shellcheck-all # matches all *.sh and #! shell files'
    echo '       shellcheck-all --color=always script/install script/publish'
}

parse_cli_args() {
    while [[ "$#" -gt 0 ]]; do
        case "$1" in
            -h | --help)
                usage
                exit 0
                ;;
            -*)
                shellcheck_options+=("$1")
                ;;
            *)
                files+=("$1")
                ;;
        esac
        shift
    done
}

is_shell_file() {
    declare file="$1"

    if [[ "$file" == *'.sh' ]]; then
        return 0
    else
        has_shell_shebang "$file"
    fi
}

has_shell_shebang() {
    declare file="$1"
    declare first_line
    read -r first_line < "$file"

    if [[ "$first_line" == '#!/usr/bin/env bash' ]]; then
        return 0
    elif [[ "$first_line" == '#!/usr/bin/env sh' ]]; then
        return 0
    elif [[ "$first_line" == '#!/bin/bash' ]]; then
        return 0
    elif [[ "$first_line" == '#!/bin/sh' ]]; then
        return 0
    fi

    return 1
}

declare -a shellcheck_options=()
declare -a files=()
parse_cli_args "$@"

# if no files specified
if [[ "${#files[@]}" == '0' ]]; then
    # assume all git tracked files
    while IFS= read -r file; do
        files+=("$file")
    done < <(comm -23 <(git ls-files) <(git ls-files --deleted))
fi

# filter for *.sh or #! shell files
declare -a shell_files=()
for file in "${files[@]}"; do
    if is_shell_file "$file"; then
        shell_files+=("$file")
    fi
done

# check all shell files
if [[ "${#shell_files[@]}" != '0' ]]; then
    shellcheck "${shellcheck_options[@]}" "${shell_files[@]}"
fi
