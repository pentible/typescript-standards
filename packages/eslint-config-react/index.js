module.exports = {
    plugins: ["react-prefer-function-component"],
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
        "react/forbid-component-props": "warn", // TODO: decide
        "react/function-component-definition": "error",
        "react/hook-use-state": "error",
        "react/iframe-missing-sandbox": "error",
        "react/no-access-state-in-setstate": "error",
        "react/no-adjacent-inline-elements": "error",
        "react/no-array-index-key": "warn",
        "react/no-danger": "warn",
        "react/no-invalid-html-attribute": "error",
        "react/no-multi-comp": "error",
        "react/no-namespace": "error",
        "react/no-this-in-sfc": "error",
        "react/no-unstable-nested-components": "error",
        "react/no-unused-prop-types": "error",
        "react/self-closing-comp": "error",
        // "react/sort-prop-types": "error", // TODO: consider along with react/jsx-sort-props
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
        "react/jsx-max-depth": ["error", { max: 10 }], // TODO: consider a lower limit
        "react/jsx-no-bind": "error",
        // "react/jsx-no-constructed-context-values": "error", // TODO: consider
        "react/jsx-no-leaked-render": [
            "error",
            { validStrategies: ["coerce", "ternary"] },
        ],
        "react/jsx-no-script-url": "error",
        "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
        "react/jsx-pascal-case": "error",
        "react/jsx-props-no-spreading": "error",
        // "react/jsx-sort-props": "error", // TODO: consider along with react/sort-prop-types
    },
};
