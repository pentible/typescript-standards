// TODO: consider: convert to ts but commit compiled version (lint-staged re-build)
const confusingBrowserGlobals = require("confusing-browser-globals");
const { jestGlobals } = require("./globals");
const { noRestrictedGlobalWithMessage } = require("./helpers");
const { naming } = require("./naming");

const enforceForJsx = "enforceForJSX";

const baseExtends = [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:sort-class-members/recommended",
    "plugin:eslint-comments/recommended",
];

module.exports = {
    extends: baseExtends,
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
            files: ["*.{spec,test}.{js,ts,jsx,tsx}"],
            extends: [
                ...baseExtends,
                "plugin:jest/recommended",
                "plugin:jest/style",
                "plugin:jest-formatting/strict",
            ],
            rules: {
                "no-restricted-globals": "off",
                "max-nested-callbacks": "off",
                "@typescript-eslint/no-magic-numbers": "off",
                "import/no-unused-modules": "off",

                // jest
                "jest/consistent-test-it": "error",
                "jest/max-nested-describe": "error",
                "jest/no-conditional-in-test": "error",
                "jest/no-duplicate-hooks": "error",
                "jest/no-large-snapshots": ["warn", { maxSize: 20 }],
                "jest/no-restricted-matchers": [
                    "error",
                    {
                        resolves: "Use `expect(await promise)` instead.",
                        toMatchSnapshot: null,
                        toThrowErrorMatchingSnapshot: null,
                    },
                ],
                "jest/no-test-return-statement": "error",
                "jest/prefer-called-with": "error",
                "jest/prefer-comparison-matcher": "error",
                "jest/prefer-equality-matcher": "error",
                "jest/prefer-expect-assertions": [
                    "warn",
                    {
                        onlyFunctionsWithExpectInLoop: true,
                        onlyFunctionsWithExpectInCallback: true,
                    },
                ],
                "jest/prefer-hooks-in-order": "error",
                "jest/prefer-hooks-on-top": "error",
                "jest/prefer-lowercase-title": [
                    "error",
                    { ignoreTopLevelDescribe: true },
                ],
                "jest/prefer-spy-on": "error",
                "jest/prefer-todo": "error",
                "jest/require-hook": "error",
                "jest/require-to-throw-message": "error",
                "jest/require-top-level-describe": "error",

                "@typescript-eslint/unbound-method": "off",
                "jest/unbound-method": "error",
            },
        },
        {
            files: ["*.js"],
            rules: {
                "@typescript-eslint/no-unsafe-assignment": "off",
                "@typescript-eslint/no-var-requires": "off",
                "@typescript-eslint/no-unsafe-member-access": "off",
                "@typescript-eslint/no-unsafe-call": "off",
                "@typescript-eslint/no-require-imports": "off",
                "import/no-unused-modules": "off",
                "import/unambiguous": "off",
            },
        },
        {
            files: ["*.d.ts"],
            rules: {
                "spaced-comment": ["error", "always", { markers: ["/"] }],
                "import/unambiguous": "off",
                "import/no-unused-modules": "off",
                "import/no-unassigned-import": "off",
            },
        },
        {
            files: ["*.tsx"],
            rules: {
                "@typescript-eslint/naming-convention": [
                    "error",
                    ...naming,
                    // react components (imperfect match so we still allow camel case)
                    {
                        selector: "function",
                        modifiers: ["exported"],
                        format: ["strictCamelCase", "StrictPascalCase"],
                    },
                ],
            },
        },
    ],
    rules: {
        // eslint
        "no-constant-binary-expression": "error",
        "no-constructor-return": "error",
        "no-promise-executor-return": "error",
        "no-self-compare": "error",
        "no-unmodified-loop-condition": "error",
        "no-unreachable-loop": "error",
        "no-unused-private-class-members": "error",
        "require-atomic-updates": "error",
        "arrow-body-style": ["error", "as-needed"],
        "block-scoped-var": "error",
        "capitalized-comments": [
            "error",
            "never",
            {
                ignorePattern: "TODO|NOTE|FIXME",
            },
        ],
        complexity: "warn", // TODO: unsure about...
        "default-case-last": "error",
        eqeqeq: ["error", "smart"],
        "func-name-matching": "error",
        "func-names": ["error", "as-needed"],
        "func-style": ["error", "declaration", { allowArrowFunctions: true }],
        "grouped-accessor-pairs": "error",
        "guard-for-in": "error",
        "max-classes-per-file": ["error", { ignoreExpressions: true }],
        "max-depth": ["error", 4],
        "max-lines": ["error", 300],
        "max-nested-callbacks": ["error", 2],
        "max-params": ["error", 4],
        "max-statements": ["warn", 20], // TODO: unsure about...
        "multiline-comment-style": ["error", "separate-lines"],
        "new-cap": "error",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-console": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-implicit-coercion": "error",
        "no-iterator": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-multi-assign": "error",
        "no-multi-str": "error",
        "no-negated-condition": "error",
        "no-nested-ternary": "error",
        "no-new": "error",
        "no-new-object": "error",
        "no-new-wrappers": "error",
        "no-octal-escape": "error",
        "no-param-reassign": "error", // TODO: consider: ["error", { "props": true }]
        "no-proto": "error",
        "no-restricted-globals": [
            "error",
            ...jestGlobals.map(
                noRestrictedGlobalWithMessage(
                    "Jest globals should not be used outside of test files",
                ),
            ),
            ...confusingBrowserGlobals.map(
                noRestrictedGlobalWithMessage(
                    "Confusing browser global, should use window property or local param instead",
                ),
            ),
        ],
        "no-return-assign": "error",
        "no-script-url": "error",
        "no-sequences": ["error", { allowInParentheses: false }],
        "no-unneeded-ternary": ["error", { defaultAssignment: false }],
        "no-useless-call": "error",
        "no-useless-computed-key": ["error", { enforceForClassMembers: true }],
        "no-useless-concat": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        // "no-warning-comments": "warn", // TODO: decide
        "object-shorthand": [
            "error",
            "always",
            { avoidQuotes: true, avoidExplicitReturnArrows: true },
        ],
        "one-var": ["error", "never"],
        "operator-assignment": "error",
        "prefer-arrow-callback": "error",
        "prefer-numeric-literals": "error",
        // "prefer-object-has-own": "error", // TODO: once proper browser support
        "prefer-object-spread": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
        "prefer-template": "error",
        radix: ["error", "as-needed"],
        "require-unicode-regexp": "error",
        // "sort-keys": ["error", "asc", { natural: true }], // TODO: doesn't seem to auto fix? find a plugin for this
        "spaced-comment": "error",
        strict: "error",
        "symbol-description": "error",
        yoda: "error",

        // typescript-eslint
        "@typescript-eslint/consistent-type-exports": [
            "error",
            { fixMixedExportsWithInlineTypeSpecifier: true },
        ],
        "@typescript-eslint/consistent-type-imports": [
            "error",
            { prefer: "type-imports" },
        ],
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            { accessibility: "no-public" },
        ],
        // TODO: consider: "@typescript-eslint/member-ordering"
        "@typescript-eslint/method-signature-style": ["error", "method"],
        "@typescript-eslint/naming-convention": ["error", ...naming],
        "@typescript-eslint/no-confusing-void-expression": [
            "error",
            { ignoreArrowShorthand: true },
        ],
        "@typescript-eslint/no-redundant-type-constituents": "error",
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/no-unnecessary-qualifier": "error",
        "@typescript-eslint/no-useless-empty-export": "error",
        "@typescript-eslint/prefer-enum-initializers": "error",
        "@typescript-eslint/prefer-readonly": "error",
        // "@typescript-eslint/prefer-readonly-parameter-types": "error", // TODO: consider?
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/require-array-sort-compare": [
            "error",
            { ignoreStringArrays: true },
        ],
        "@typescript-eslint/sort-type-union-intersection-members": "error",
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "@typescript-eslint/default-param-last": "error",
        "@typescript-eslint/init-declarations": "error",
        "@typescript-eslint/no-invalid-this": "error",
        "@typescript-eslint/no-loop-func": "error",
        "@typescript-eslint/no-magic-numbers": [
            "error",
            {
                ignoreArrayIndexes: true,
                ignoreDefaultValues: true,
                ignoreEnums: true,
                ignoreTypeIndexes: true,
                ignore: [0, 1],
            },
        ],
        // "@typescript-eslint/no-shadow": ["error", { builtinGlobals: true }], // TODO: decide
        "@typescript-eslint/no-throw-literal": "error",
        "@typescript-eslint/no-unused-expressions": [
            "error",
            { [enforceForJsx]: true },
        ],

        // import
        "import/no-absolute-path": "error",
        "import/no-self-import": "error",
        "import/no-useless-path-segments": [
            "error",
            {
                noUselessIndex: true,
            },
        ],
        "import/no-relative-packages": "error",
        "import/no-deprecated": "warn",
        "import/no-extraneous-dependencies": [
            "error",
            { devDependencies: ["**/*.{spec,test}.{js,ts,jsx,tsx}"] },
        ],
        "import/no-mutable-exports": "error",
        "import/no-unused-modules": [
            "error",
            // TODO: may want to disable in libraries (because of unusedExports)
            // TODO: would be nice to be able to enable missingExports, entry points are problematic though
            // TODO: would also be nice if it allowed otherwise unused types on used exports
            { unusedExports: true },
        ],
        "import/unambiguous": "error",
        "import/no-import-module-exports": "error",
        "import/first": "error",
        "import/no-namespace": "error",
        "import/extensions": [
            "error",
            "never",
            { svg: "always", json: "always", css: "always" },
        ],
        // TODO: consider: https://www.npmjs.com/package/eslint-plugin-simple-import-sort
        "import/order": [
            "error",
            {
                alphabetize: {
                    order: "asc",
                    caseInsensitive: true,
                },
                "newlines-between": "never",
            },
        ],
        "import/newline-after-import": "error", // TODO: once released: ["error", { considerComments: true }]
        "import/no-default-export": "error",
        "import/no-unassigned-import": [
            "error",
            {
                allow: [
                    "**/*.css",
                    "@testing-library/jest-dom",
                    "@testing-library/jest-dom/**",
                    "ghspa",
                    "@fontsource/**",
                ],
            },
        ],
        "import/no-named-default": "error",
        "import/no-anonymous-default-export": "error",

        // eslint-comments
        "eslint-comments/no-unused-disable": "error",
        // NOTE: default to just not allowing disable comments, projects can override this as needed
        "eslint-comments/no-use": "error",
    },
};
