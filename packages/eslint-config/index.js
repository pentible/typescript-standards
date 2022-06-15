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
        tsconfigRootDir: ".",
        project: ["tsconfig.json", "packages/*/tsconfig.json"],
    },
    settings: {
        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
                project: ["tsconfig.json", "packages/*/tsconfig.json"],
            },
        },
    },
    env: {
        es2022: true,
    },
    overrides: [
        {
            files: ["*.{spec,test}.ts"],
            rules: {
                "no-restricted-globals": "off",
            },
        },
    ],
    rules: {
        // TODO:
        "eslint-comments/no-unused-disable": "error",
        "no-restricted-globals": [
            "error",
            // jest globals
            "afterAll",
            "afterEach",
            "beforeAll",
            "beforeEach",
            "describe",
            "expect",
            "fail",
            "fdescribe",
            "fit",
            "it",
            "jasmine",
            "jest",
            "pending",
            "spyOn",
            "test",
            "xdescribe",
            "xit",
            "xtest",
        ],
    },
};
