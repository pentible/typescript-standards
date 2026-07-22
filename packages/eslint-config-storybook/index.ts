import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";
import { configs as storybook } from "eslint-plugin-storybook";

const name = "@pentible/eslint-config-storybook";

export const pentibleStorybook = defineConfig([
    {
        name,
        // TODO: remove once types are fixed: https://github.com/storybookjs/storybook/issues/32405
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        extends: [storybook["flat/recommended"] as Linter.Config],
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
