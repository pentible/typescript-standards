const { naming } = require("@pentible/eslint-config/naming");

/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ["next/core-web-vitals"],
    settings: {
        next: {
            rootDir: ["packages/*", "apps/*", "."],
        },
    },
    overrides: [
        {
            files: ["src/{pages,app}/**/*.{js,jsx,ts,tsx}"],
            rules: {
                "import/no-default-export": "off",
                "import/no-unused-modules": "off",
            },
        },
        {
            files: ["src/pages/_app.{js,jsx,ts,tsx}"],
            rules: {
                "react/jsx-props-no-spreading": "off",
            },
        },
        {
            files: ["src/app/**/route.{js,ts}"],
            rules: {
                "@typescript-eslint/naming-convention": [
                    "error",
                    {
                        format: ["UPPER_CASE"],
                        selector: "function",
                        modifiers: ["exported"],
                        filter: {
                            regex: "^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$",
                            match: true,
                        },
                    },
                    ...naming,
                ],
            },
        },
    ],
    rules: {
        "@typescript-eslint/dot-notation": "off",
    },
};
