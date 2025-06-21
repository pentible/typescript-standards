import { defineConfig } from "eslint/config";
import compat from "eslint-plugin-compat";
import globals from "globals";

export const pentibleWeb = defineConfig({
    name: "@pentible/eslint-config-web",
    extends: [compat.configs["flat/recommended"]],
    languageOptions: {
        globals: {
            ...globals.browser,
        },
    },
});
