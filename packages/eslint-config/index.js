// TODO: try to convert to .ts (should allow us to fix eslint)
module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:eslint-comments/recommended",
        "plugin:jest/recommended",
        "plugin:jest/style",
        "prettier",
    ],
    parserOptions: {
        sourceType: "module",
        // TODO: is there a way to make this work better without having a tsconfig here?
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
    },
    env: {
        es2018: true,
    },
    rules: {
        // TODO:
        "eslint-comments/no-unused-disable": "error",
    },
};
