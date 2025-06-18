import { defineConfig } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

const name = "@pentible/eslint-config-react";

export const pentibleEslintConfigReact = defineConfig({
    name,
    extends: [
        // @ts-expect-error https://github.com/jsx-eslint/eslint-plugin-react/issues/3878
        react.configs.flat.recommended,
        // @ts-expect-error https://github.com/jsx-eslint/eslint-plugin-react/issues/3878
        react.configs.flat["jsx-runtime"],
        reactHooks.configs["recommended-latest"],
        jsxA11y.flatConfigs.strict,
    ],
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
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
});
