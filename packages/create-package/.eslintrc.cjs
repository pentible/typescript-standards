"use strict";

/** @type {import('eslint').Linter.Config} */
module.exports = {
    overrides: [
        {
            files: ["src/cli/prompt-package-context.ts"],
            rules: {
                "no-param-reassign": ["error", { props: false }],
            },
        },
    ],
};
