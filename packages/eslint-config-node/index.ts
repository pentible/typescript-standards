import { defineConfig } from "eslint/config";
import node from "eslint-plugin-n";
import globals from "globals";

export const pentibleNode = defineConfig({
    name: "@pentible/eslint-config-node",
    extends: [node.configs["flat/mixed-esm-and-cjs"]],
    languageOptions: {
        globals: {
            ...globals.node,
        },
    },
    rules: {
        // eslint
        "no-console": "off",
    },
});
