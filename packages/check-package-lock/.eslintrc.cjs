"use strict";

/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ["@pentible/eslint-config-node"],
    overrides: [
        {
            files: ["src/check-conflicting-dependencies.ts"],
            rules: {
                "import/no-named-as-default": "off",
            },
        },
    ],
};
