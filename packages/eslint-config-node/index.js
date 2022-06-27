module.exports = {
    extends: [
        // TODO: consider eslint-plugin-n/eslint-plugin-node once properly updated
        "prettier",
    ],
    env: {
        node: true,
    },
    rules: {
        // eslint
        "no-console": "off",
    },
};
