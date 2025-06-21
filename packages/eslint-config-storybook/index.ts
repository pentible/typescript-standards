import { defineConfig } from "eslint/config";
import storybook from "eslint-plugin-storybook";

const name = "@pentible/eslint-config-storybook";

export const pentibleStorybook = defineConfig([
    {
        name,
        extends: [storybook.configs["flat/recommended"]],
    },
    {
        name,
        files: ["**/*.stories.ts"],
        rules: {
            "import-x/no-default-export": "off",
            "import-x/no-unused-modules": "off",
        },
    },
]);
