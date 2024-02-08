/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ["plugin:storybook/recommended"],
    overrides: [
        {
            files: ["*.stories.ts"],
            rules: {
                "import/no-default-export": "off",
                "import/no-unused-modules": "off",
            },
        },
    ],
};
