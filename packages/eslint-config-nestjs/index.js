const { decorators } = require("./decorators");

module.exports = {
    rules: {
        "new-cap": ["error", { capIsNewExceptions: decorators }],
    },
    overrides: [
        {
            files: "*.module.ts",
            rules: {
                "@typescript-eslint/no-extraneous-class": [
                    "error",
                    { allowWithDecorator: true },
                ],
            },
        },
    ],
};
