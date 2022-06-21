module.exports = {
    extends: [
        "./",
        // TODO: react plugins... ? probably need to move this to its own package
        "prettier",
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        // TODO:
    },
};
