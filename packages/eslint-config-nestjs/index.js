const { decorators } = require("./decorators");
const { typeHelpers } = require("./typeHelpers");

module.exports = {
    rules: {
        "new-cap": [
            "error",
            { capIsNewExceptions: [...decorators, ...typeHelpers] },
        ],
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
        {
            files: "*.dto.ts",
            rules: {
                "max-classes-per-file": ["error", { max: 2 }],
            },
        },
    ],
};
