import next from "@next/eslint-plugin-next";
import { naming } from "@pentible/eslint-config";
import { defineConfig } from "eslint/config";

const name = "@pentible/eslint-config-next";

export const pentibleNext = defineConfig([
    {
        name,
        extends: [next.flatConfig.coreWebVitals],
        settings: {
            next: {
                rootDir: ["packages/*", "apps/*", "."],
            },
        },
    },
    {
        name,
        files: [
            "**/src/{pages,app}/**/*.{js,jsx,ts,tsx}",
            "**/src/middleware.ts",
        ],
        rules: {
            "import-x/no-default-export": "off",
            "import-x/no-unused-modules": "off",
            "import-x/no-anonymous-default-export": "off",
        },
    },
    {
        name,
        files: ["**/src/pages/_app.{js,jsx,ts,tsx}"],
        rules: {
            "react/jsx-props-no-spreading": "off",
        },
    },
    {
        name,
        files: ["**/src/app/**/route.ts"],
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    format: ["UPPER_CASE"],
                    selector: "function",
                    modifiers: ["exported"],
                    filter: {
                        regex: "^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$",
                        match: true,
                    },
                },
                ...naming,
            ],
        },
    },
]);
