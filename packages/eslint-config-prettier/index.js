/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ["prettier"],
    rules: {
        // NOTE: if misconfigured these will conflict with prettier, see:
        // https://github.com/prettier/eslint-config-prettier#special-rules
        curly: ["error", "all"],
        // NOTE: https://prettier.io/docs/en/options.html#print-width
        "max-len": [
            "error",
            {
                code: 120,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],
        "no-tabs": ["error", { allowIndentationTabs: true }],
    },
    overrides: [
        {
            files: ["*.{ts,tsx}"],
            rules: {
                "@typescript-eslint/quotes": [
                    "error",
                    "double",
                    { avoidEscape: true, allowTemplateLiterals: false },
                ],
            },
        },
    ],
};
