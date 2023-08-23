"use strict";

/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ["@pentible/eslint-config-node"],
    overrides: [
        {
            files: ["src/cli/prompt-package-context.ts"],
            rules: {
                "no-param-reassign": ["error", { props: false }],
            },
        },
    ],
};
