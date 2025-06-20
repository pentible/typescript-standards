import { naming } from "@pentible/eslint-config";
import { defineConfig } from "eslint/config";

const name = "@pentible/eslint-config-expo";

export const pentibleEslintConfigExpo = defineConfig([
    {
        name,
        files: ["**/src/app/**/*.{js,jsx,ts,tsx}"],
        rules: {
            "import-x/no-default-export": "off",
            "import-x/no-unused-modules": "off",
        },
    },
    {
        name,
        files: ["**/src/app/**/*.{ts,tsx}"],
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    format: ["snake_case"],
                    selector: "variable",
                    modifiers: ["exported"],
                    filter: {
                        regex: "^unstable_settings$",
                        match: true,
                    },
                },
                ...naming,
            ],
        },
    },
]);
