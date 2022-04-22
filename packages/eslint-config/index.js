module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "prettier",
    ],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2018,
        // TODO: is there a way to make this work better without having a tsconfig here?
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
    },
    rules: {
        // TODO:
    },
};
