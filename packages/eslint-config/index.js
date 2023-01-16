const confusingBrowserGlobals = require("confusing-browser-globals");
const { noRestrictedGlobalWithMessage } = require("./helpers");
const { naming } = require("./naming");

/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@typescript-eslint/strict",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:sort-class-members/recommended",
        "plugin:eslint-comments/recommended",
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
            // TODO: debug: ["*.{js,cjs}"]
            files: ["*.js"],
            rules: {
                "@typescript-eslint/no-require-imports": "off",
                "@typescript-eslint/no-unsafe-argument": "off",
                "@typescript-eslint/no-unsafe-assignment": "off",
                "@typescript-eslint/no-unsafe-call": "off",
                "@typescript-eslint/no-unsafe-member-access": "off",
                "@typescript-eslint/no-var-requires": "off",
                "@typescript-eslint/prefer-optional-chain": "off", // TODO: remove once reasonable js support: https://caniuse.com/?search=optional%20chaining
                "import/no-unused-modules": "off",
                "import/unambiguous": "off",
            },
        },
        {
            files: ["*.d.ts"],
            rules: {
                "spaced-comment": ["error", "always", { markers: ["/"] }],
                "import/unambiguous": "off",
                "import/no-unused-modules": [
                    "error",
                    { unusedExports: true, missingExports: false },
                ],
                "import/no-unassigned-import": "off",
                "no-var": "off",
            },
        },
        {
            // TODO: debug: ["*.{jsx,tsx}"]
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
        "default-case-last": "error",
        eqeqeq: ["error", "smart"],
        "func-name-matching": "error",
        "func-names": ["error", "as-needed"],
        "func-style": ["error", "declaration", { allowArrowFunctions: true }],
        "grouped-accessor-pairs": "error",
        "guard-for-in": "error",
        "max-depth": ["error", 4],
        "max-nested-callbacks": ["error", 2],
        "max-params": ["error", 4],
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
        "no-param-reassign": ["error", { props: true }],
        "no-proto": "error",
        "no-restricted-globals": [
            "error",
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
        "object-shorthand": ["error", "always", { avoidQuotes: true }],
        "one-var": ["error", "never"],
        "operator-assignment": "error",
        "prefer-arrow-callback": "error",
        "prefer-numeric-literals": "error",
        // "prefer-object-has-own": "error", // TODO: once better browser support: https://caniuse.com/?search=object.hasOwn
        "prefer-object-spread": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
        "prefer-template": "error",
        radix: ["error", "as-needed"],
        "require-unicode-regexp": "error",
        "spaced-comment": "error",
        strict: "error",
        "symbol-description": "error",
        yoda: "error",
        "logical-assignment-operators": "error",
        "no-empty-static-block": "error",
        "no-new-native-nonconstructor": "error",

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
        "@typescript-eslint/method-signature-style": "error",
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
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/require-array-sort-compare": [
            "error",
            { ignoreStringArrays: true },
        ],
        "@typescript-eslint/sort-type-union-intersection-members": "error",
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "@typescript-eslint/default-param-last": "error",
        "@typescript-eslint/init-declarations": "error",
        "@typescript-eslint/no-empty-function": [
            "error",
            { allow: ["private-constructors"] },
        ],
        "@typescript-eslint/no-invalid-this": "error",
        "@typescript-eslint/no-loop-func": "error",
        "@typescript-eslint/no-magic-numbers": [
            "error",
            {
                ignoreArrayIndexes: true,
                ignoreDefaultValues: true,
                ignoreClassFieldInitialValues: true,
                ignoreEnums: true,
                ignoreReadonlyClassProperties: true,
                ignoreTypeIndexes: true,
                ignore: [-1, 0, 1],
            },
        ],
        "@typescript-eslint/no-throw-literal": "error",
        "@typescript-eslint/no-unused-expressions": [
            "error",
            { enforceForJSX: true },
        ],
        "@typescript-eslint/no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_" },
        ],

        // import
        "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
        "import/no-absolute-path": "error",
        "import/no-empty-named-blocks": "error",
        "import/no-self-import": "error",
        "import/no-useless-path-segments": [
            "error",
            {
                noUselessIndex: true,
            },
        ],
        "import/no-relative-packages": "error",
        "import/no-deprecated": "warn",
        "import/no-extraneous-dependencies": ["error", { includeTypes: true }],
        "import/no-mutable-exports": "error",
        "import/no-unused-modules": [
            "error",
            // NOTE: missingExports will need to be overridden for entrypoints
            { unusedExports: true, missingExports: true },
        ],
        "import/unambiguous": "error",
        "import/no-import-module-exports": "error",
        "import/first": "error",
        "import/no-namespace": "error",
        "import/extensions": [
            "error",
            "never",
            { svg: "always", json: "always", css: "always", scss: "always" },
        ],
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
        "import/newline-after-import": "error",
        "import/no-default-export": "error",
        "import/no-unassigned-import": [
            "error",
            {
                allow: ["**/*.css", "**/*.scss", "@fontsource/**"],
            },
        ],
        "import/no-named-default": "error",
        "import/no-anonymous-default-export": [
            "error",
            { allowCallExpression: false },
        ],

        // eslint-comments
        "eslint-comments/no-unused-disable": "error",
        // NOTE: default to just not allowing disable comments, projects can override this as needed
        "eslint-comments/no-use": "error",
    },
};
