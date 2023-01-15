/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
    extends: ["next/core-web-vitals"],
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
