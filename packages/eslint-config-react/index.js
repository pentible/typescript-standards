/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: [
        "plugin:react/recommended",
        "plugin:react-prefer-function-component/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/strict",
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        // react
        "react/button-has-type": "error",
        "react/destructuring-assignment": "error",
        "react/function-component-definition": "error",
        "react/hook-use-state": ["error", { allowDestructuredState: true }],
        "react/iframe-missing-sandbox": "error",
        "react/no-adjacent-inline-elements": "error",
        "react/no-array-index-key": "warn",
        "react/no-danger": "warn",
        "react/no-namespace": "error",
        "react/no-this-in-sfc": "error",
        "react/no-unstable-nested-components": "error",
        "react/no-unused-prop-types": "error",
        "react/self-closing-comp": "error",
        "react/void-dom-elements-no-children": "error",
        "react/jsx-boolean-value": "error",
        "react/jsx-curly-brace-presence": [
            "error",
            { propElementValues: "always" },
        ],
        "react/jsx-filename-extension": [
            "error",
            { allow: "as-needed", extensions: [".jsx", ".tsx"] },
        ],
        "react/jsx-fragments": "error",
        "react/jsx-handler-names": "error",
        "react/jsx-max-depth": ["error", { max: 8 }],
        "react/jsx-no-constructed-context-values": "error",
        "react/jsx-no-leaked-render": "error",
        "react/jsx-no-script-url": "error",
        "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
        "react/jsx-pascal-case": "error",
        "react/jsx-props-no-spread-multi": "error",
        "react/jsx-props-no-spreading": "error",
    },
};
