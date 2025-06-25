import { defineConfig } from "eslint/config";
import node from "eslint-plugin-n";
import globals from "globals";

const name = "@pentible/eslint-config-node";
export const pentibleNode = defineConfig([
    {
        name,
        extends: [node.configs["flat/recommended"]],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        rules: {
            // eslint
            "no-console": "off",
            // node
            "n/prefer-promises/dns": "error",
            "n/prefer-promises/fs": "error",
        },
    },
    {
        name,
        files: ["**/*.mjs"],
        extends: [node.configs["flat/recommended-module"]],
    },
    {
        name,
        files: ["**/*.cjs"],
        extends: [node.configs["flat/recommended-script"]],
    },
    {
        name,
        rules: {
            // NOTE: doesn't support subpath imports properly
            "n/no-missing-import": "off",
            // NOTE: doesn't work properly when the file is built
            "n/hashbang": "off",
            // NOTE: this rule is just dumb, throwing is not an appropriate
            // alternative, I want to control the output of cli's
            "n/no-process-exit": "off",
        },
    },
]);
