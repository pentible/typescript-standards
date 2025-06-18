import { defineConfig } from "eslint/config";
import globals from "globals";

export const pentibleEslintConfigNode = defineConfig({
    name: "@pentible/eslint-config-node",
    extends: [
        // TODO: consider eslint-plugin-n/eslint-plugin-node once properly updated
    ],
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
