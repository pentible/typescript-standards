const confusingBrowserGlobals = require("confusing-browser-globals");
const { noRestrictedGlobalWithMessage } = require("./helpers");
const { naming } = require("./naming");

/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ["eslint:recommended", "plugin:import/recommended"],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2022,
    },
    env: {
        es2022: true,
    },
    overrides: [
        {
            files: ["*.cjs"],
            parserOptions: {
                sourceType: "script",
            },
        },
        {
            files: ["*.{js,cjs,mjs}"],
            env: {
                node: true,
            },
            rules: {
                "import/no-unused-modules": "off",
                "import/unambiguous": "off",
            },
        },
        {
            files: ["*.{ts,tsx}"],
            extends: [
                "plugin:@typescript-eslint/strict-type-checked",
                "plugin:@typescript-eslint/stylistic-type-checked",
                "plugin:import/typescript",
            ],
            parserOptions: {
                tsconfigRootDir: ".",
                projectService: true,
            },
            settings: {
                "import/resolver": {
                    typescript: {
                        alwaysTryTypes: true,
                        project: [
                            "tsconfig.json",
                            "packages/*/tsconfig.json",
                            "apps/*/tsconfig.json",
                        ],
                    },
                },
            },
            rules: {
                // typescript-eslint
                "@typescript-eslint/consistent-type-assertions": [
                    "error",
                    { assertionStyle: "never" },
                ],
                "@typescript-eslint/consistent-type-exports": "error",
                "@typescript-eslint/consistent-type-imports": "error",
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
                "@typescript-eslint/no-duplicate-type-constituents": "error",
                "@typescript-eslint/no-import-type-side-effects": "error",
                "@typescript-eslint/no-redundant-type-constituents": "error",
                "@typescript-eslint/no-unnecessary-condition": [
                    "error",
                    {
                        allowConstantLoopConditions: "only-allowed-literals",
                        checkTypePredicates: true,
                    },
                ],
                "@typescript-eslint/no-unnecessary-parameter-property-assignment":
                    "error",
                "@typescript-eslint/no-unnecessary-type-conversion": "error",
                "@typescript-eslint/no-unnecessary-qualifier": "error",
                "@typescript-eslint/no-useless-empty-export": "error",
                "@typescript-eslint/only-throw-error": [
                    "error",
                    { allowRethrowing: true },
                ],
                "@typescript-eslint/prefer-enum-initializers": "error",
                "@typescript-eslint/prefer-nullish-coalescing": [
                    "error",
                    { ignoreIfStatements: true },
                ],
                "@typescript-eslint/prefer-readonly": "error",
                "@typescript-eslint/promise-function-async": "error",
                "@typescript-eslint/require-array-sort-compare": "error",
                "@typescript-eslint/restrict-template-expressions": [
                    "error",
                    {
                        allowNumber: true,
                    },
                ],
                "@typescript-eslint/return-await": ["error", "always"],
                "@typescript-eslint/strict-boolean-expressions": "error",
                "@typescript-eslint/switch-exhaustiveness-check": [
                    "error",
                    {
                        allowDefaultCaseForExhaustiveSwitch: false,
                        requireDefaultForNonUnion: true,
                    },
                ],
                "@typescript-eslint/default-param-last": "error",
                "@typescript-eslint/init-declarations": "error",
                "@typescript-eslint/no-empty-function": [
                    "error",
                    { allow: ["private-constructors"] },
                ],
                "@typescript-eslint/no-loop-func": "error",
                "@typescript-eslint/no-unused-expressions": [
                    "error",
                    { enforceForJSX: true },
                ],
                "@typescript-eslint/no-unused-vars": [
                    "error",
                    {
                        args: "all",
                        argsIgnorePattern: "^_",
                        varsIgnorePattern: "^_",
                        caughtErrorsIgnorePattern: "^_",
                        destructuredArrayIgnorePattern: "^_",
                        reportUsedIgnorePattern: true,
                    },
                ],
            },
        },
        {
            files: ["*.d.ts"],
            rules: {
                "import/unambiguous": "off",
                "import/no-unused-modules": "off",
                "import/no-unassigned-import": "off",
                "import/no-default-export": "off",
            },
        },
        {
            files: ["*.config.{ts,mjs}"],
            rules: {
                "import/no-unused-modules": "off",
                "import/no-default-export": "off",
            },
        },
        {
            files: ["main.{ts,tsx}", "index.{ts,tsx}"],
            rules: {
                "import/no-unused-modules": "off",
            },
        },
        {
            files: ["*.{test,spec}.{ts,tsx}"],
            rules: {
                "import/no-unused-modules": "off",
            },
        },
    ],
    rules: {
        // eslint
        "no-constructor-return": "error",
        "no-promise-executor-return": "error",
        "no-self-compare": "error",
        "no-unmodified-loop-condition": "error",
        "no-unreachable-loop": "error",
        "no-useless-assignment": "error",
        "require-atomic-updates": "error",
        "block-scoped-var": "error",
        "default-case-last": "error",
        eqeqeq: ["error", "smart"],
        "func-name-matching": "error",
        "func-names": ["error", "as-needed"],
        "func-style": ["error", "declaration", { allowArrowFunctions: true }],
        "grouped-accessor-pairs": "error",
        "guard-for-in": "error",
        "multiline-comment-style": ["error", "separate-lines"],
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
        "no-nested-ternary": "error",
        "no-new": "error",
        "no-new-wrappers": "error",
        "no-object-constructor": "error",
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
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "object-shorthand": ["error", "always", { avoidQuotes: true }],
        "one-var": ["error", "never"],
        "operator-assignment": "error",
        "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
        "prefer-numeric-literals": "error",
        "prefer-object-has-own": "error",
        "prefer-object-spread": "error",
        "prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
        "prefer-template": "error",
        radix: "error",
        "require-unicode-regexp": "error",
        strict: "error",
        "symbol-description": "error",
        yoda: "error",
        "logical-assignment-operators": "error",

        // import
        "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
        "import/no-absolute-path": "error",
        "import/no-empty-named-blocks": "error",
        "import/no-self-import": "error",
        "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
        "import/no-relative-packages": "error",
        "import/no-deprecated": "warn",
        "import/no-extraneous-dependencies": ["error", { includeTypes: true }],
        "import/no-mutable-exports": "error",
        "import/no-unused-modules": [
            "warn",
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
            {
                svg: "always",
                json: "always",
                css: "always",
                scss: "always",
                ttf: "always",
                otf: "always",
                woff: "always",
                woff2: "always",
            },
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
                allow: [
                    "**/*.css",
                    "**/*.scss",
                    "@fontsource/**",
                    "expo-router/entry",
                    "server-only",
                ],
            },
        ],
        "import/no-named-default": "error",
        "import/no-anonymous-default-export": [
            "error",
            { allowCallExpression: false },
        ],
    },
};
