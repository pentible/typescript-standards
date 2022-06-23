module.exports = {
    extends: [
        // TODO: consider whether these configs should include base... might be better for monorepo packages to not?
        "./",
        // TODO: node plugins... ? probably need to move this to its own package
        "prettier",
    ],
    rules: {
        // TODO:
        "no-console": "off",
    },
    env: {
        node: true,
    },
};
