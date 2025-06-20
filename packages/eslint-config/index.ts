import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import eslintJs from "@eslint/js";
import confusingBrowserGlobals from "confusing-browser-globals";
import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { createNodeResolver, importX } from "eslint-plugin-import-x";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * ```ts
 * import confusingBrowserGlobals from "confusing-browser-globals";
 * // ...
 * "no-restricted-globals": [
 *     "error",
 *     ...confusingBrowserGlobals.map(
 *         noRestrictedGlobalWithMessage(
 *             "Confusing browser global, should use window property or local param instead",
 *         ),
 *     ),
 * ],
 * ```
 */
export function noRestrictedGlobalWithMessage(message: string) {
    return (name: string) => ({ name, message });
}

/**
 * default naming conventions
 */
export const naming = [
    // default
    {
        selector: "default",
        format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
    },
    // unused variables
    {
        selector: "variableLike",
        modifiers: ["unused"],
        format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
    },
    // properties on object literals (to ease interfacing with external code)
    { selector: "objectLiteralProperty", format: null },
    // functions
    { selector: "function", format: ["strictCamelCase", "StrictPascalCase"] },
    // types & enum members
    { selector: ["typeLike", "enumMember"], format: ["StrictPascalCase"] },
];

/**
 * Reads an ignore file and returns an object with the ignore patterns.
 * @param {string} file The relative path (from your eslint config) to the ignore file. ie. `.gitignore`
 * @param {string} base `import.meta.url`
 * @param {string} [name] The name of the ignore file config.
 * @example
 * ```ts
 * relativeIgnoreFile(".gitignore", import.meta.url)
 * ```
 */
export function relativeIgnoreFile(file: string, base: string, name?: string) {
    return includeIgnoreFile(fileURLToPath(new URL(file, base)), name);
}

const name = "@pentible/eslint-config";

export const pentibleEslintConfig = defineConfig([
    {
        name,
        extends: [
            eslintJs.configs.recommended,
            // TODO: remove once types are fixed
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            importX.flatConfigs.recommended as Linter.Config,
        ],
        rules: {
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
            "func-style": [
                "error",
                "declaration",
                { allowArrowFunctions: true },
            ],
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
            "prefer-regex-literals": [
                "error",
                { disallowRedundantWrapping: true },
            ],
            "prefer-template": "error",
            radix: "error",
            "require-unicode-regexp": "error",
            "symbol-description": "error",
            yoda: "error",
            "logical-assignment-operators": "error",
            "import-x/consistent-type-specifier-style": [
                "error",
                "prefer-top-level",
            ],
            "import-x/no-absolute-path": "error",
            "import-x/no-empty-named-blocks": "error",
            "import-x/no-self-import": "error",
            "import-x/no-useless-path-segments": [
                "error",
                { noUselessIndex: true },
            ],
            "import-x/no-relative-packages": "error",
            "import-x/no-deprecated": "warn",
            "import-x/no-extraneous-dependencies": [
                "error",
                { includeTypes: true },
            ],
            "import-x/no-mutable-exports": "error",
            "import-x/no-unused-modules": [
                "warn",
                {
                    unusedExports: true,
                    missingExports: true,
                },
            ],
            "import-x/unambiguous": "error",
            "import-x/no-import-module-exports": "error",
            "import-x/first": "error",
            "import-x/no-namespace": "error",
            "import-x/extensions": [
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
            "import-x/order": [
                "error",
                {
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                    "newlines-between": "never",
                },
            ],
            "import-x/newline-after-import": "error",
            "import-x/no-default-export": "error",
            "import-x/no-unassigned-import": [
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
            "import-x/no-named-default": "error",
            "import-x/no-anonymous-default-export": [
                "error",
                { allowCallExpression: false },
            ],
        },
    },
    {
        name,
        files: ["**/*.{js,cjs,mjs}"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "import-x/no-unused-modules": "off",
            "import-x/unambiguous": "off",
        },
    },
    {
        name,
        files: ["**/*.{ts,tsx}"],
        extends: [
            // TODO: remove once types are fixed: https://github.com/typescript-eslint/typescript-eslint/issues/10935
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, import-x/no-named-as-default-member
            tseslint.configs.strictTypeChecked as Linter.Config,
            // TODO: remove once types are fixed: https://github.com/typescript-eslint/typescript-eslint/issues/10935
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, import-x/no-named-as-default-member
            tseslint.configs.stylisticTypeChecked as Linter.Config,
            // TODO: remove once types are fixed
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            importX.flatConfigs.typescript as Linter.Config,
        ],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: ".",
                projectService: true,
            },
        },
        settings: {
            "import-x/resolver-next": [
                createTypeScriptImportResolver({
                    alwaysTryTypes: true, // TODO: drop with eslint-import-resolver-typescript@4
                    project: [
                        // TODO: test without references
                        "tsconfig.json",
                        "packages/*/tsconfig.json",
                        "apps/*/tsconfig.json",
                    ],
                }),
                createNodeResolver(),
            ],
        },
        rules: {
            // typescript-eslint
            "@typescript-eslint/consistent-type-assertions": [
                "error",
                { assertionStyle: "never" },
            ],
            "@typescript-eslint/consistent-type-exports": "error",
            "@typescript-eslint/consistent-type-imports": [
                "error",
                { disallowTypeAnnotations: false },
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
            "@typescript-eslint/no-duplicate-type-constituents": "error",
            "@typescript-eslint/no-floating-promises": [
                "error",
                { checkThenables: true },
            ],
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
                { allowNumber: true },
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
        name,
        files: ["**/*.d.ts"],
        rules: {
            "import-x/unambiguous": "off",
            "import-x/no-unused-modules": "off",
            "import-x/no-unassigned-import": "off",
            "import-x/no-default-export": "off",
        },
    },
    {
        name,
        files: ["**/*.config.{ts,mjs}"],
        rules: {
            "import-x/no-unused-modules": "off",
            "import-x/no-default-export": "off",
        },
    },
    {
        name,
        files: ["**/main.{ts,tsx}", "**/index.{ts,tsx}"],
        rules: {
            "import-x/no-unused-modules": "off",
        },
    },
    {
        name,
        files: ["**/*.{test,spec}.{ts,tsx}"],
        rules: {
            "import-x/no-unused-modules": "off",
        },
    },
]);
