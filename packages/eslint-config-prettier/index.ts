import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier/flat";

export const pentiblePrettier = defineConfig({
    name: "@pentible/eslint-config-prettier",
    extends: [prettier],
    rules: {
        // NOTE: if misconfigured these will conflict with prettier, see:
        // https://github.com/prettier/eslint-config-prettier#special-rules
        curly: ["error", "all"],
    },
});
