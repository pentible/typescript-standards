/**
 * @type {import('eslint').ESLint.ConfigData}
 */
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
    ],
    rules: {
        "@typescript-eslint/dot-notation": "off",
    },
};
