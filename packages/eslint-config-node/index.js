/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: [
        // TODO: consider eslint-plugin-n/eslint-plugin-node once properly updated
    ],
    env: {
        node: true,
    },
    rules: {
        // eslint
        "no-console": "off",
    },
};
