#!/usr/bin/env bash

set -e

usage() {
    echo 'usage: jest-silent [--useDots] [--noShowWarnings] [--noShowPaths] [<jest-options>]...'
    echo ''
    echo 'options:'
    echo '  --useDots option to output dots for each test file'
    echo '  --noShowWarnings option to disable printing warnings'
    echo '  --noShowPaths option to disable printing paths to tests'
    echo '  <jest-options> any unrecognized options will be forwarded to jest'
    echo ''
    jest --help
}

parse_cli_args() {
    while [[ "$#" -gt 0 ]]; do
        case "$1" in
            --useDots)
                useDots='true'
                ;;
            --noShowWarnings)
                showWarnings='false'
                ;;
            --noShowPaths)
                showPaths='false'
                ;;
            -h | --help)
                usage
                exit 0
                ;;
            *)
                jestArgs+=("$1")
                ;;
        esac
        shift
    done
}

declare -a jestArgs=()
declare useDots='false'
declare showWarnings='true'
declare showPaths='true'

parse_cli_args "$@"

export JEST_SILENT_REPORTER_DOTS="${useDots}"
export JEST_SILENT_REPORTER_SHOW_WARNINGS="${showWarnings}"
export JEST_SILENT_REPORTER_SHOW_PATHS="${showPaths}"

jest --reporters=jest-silent-reporter "${jestArgs[@]}"
