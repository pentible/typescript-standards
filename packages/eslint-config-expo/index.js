const { naming } = require("@pentible/eslint-config/naming");

/** @type {import('eslint').Linter.Config} */
module.exports = {
    overrides: [
        {
            files: ["src/app/**/*.{js,jsx,ts,tsx}"],
            rules: {
                "import/no-default-export": "off",
                "import/no-unused-modules": "off",
            },
        },
        {
            files: ["src/app/**/*.{ts,tsx}"],
            rules: {
                "@typescript-eslint/naming-convention": [
                    "error",
                    {
                        format: ["snake_case"],
                        selector: "variable",
                        modifiers: ["exported"],
                        filter: {
                            regex: "^unstable_settings$",
                            match: true,
                        },
                    },
                    ...naming,
                ],
            },
        },
    ],
};
