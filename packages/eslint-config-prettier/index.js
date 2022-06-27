module.exports = {
    extends: ["prettier"],
    rules: {
        // NOTE: if misconfigured these will conflict with prettier, see:
        // https://github.com/prettier/eslint-config-prettier#special-rules
        curly: ["error", "all"],
        "max-len": ["error", { code: 120, ignoreUrls: true }], // NOTE: https://prettier.io/docs/en/options.html#print-width
        "no-tabs": ["error", { allowIndentationTabs: true }],
        "@typescript-eslint/quotes": [
            "error",
            "double",
            { avoidEscape: true, allowTemplateLiterals: false },
        ],
    },
};
