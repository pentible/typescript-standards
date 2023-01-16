/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
    extends: ["next/core-web-vitals"],
    settings: {
        next: {
            rootDir: ["packages/*", "."],
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
    ],
};
