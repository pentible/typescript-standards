# eslint-config-storybook

## usage

- `npm i -D @pentible/eslint-config @pentible/eslint-config-storybook @pentible/eslint-config-prettier`

- `eslint.config.mjs`

```js
import {
    pentibleEslintConfig,
    relativeIgnoreFile,
} from "@pentible/eslint-config";
import { pentibleEslintConfigStorybook } from "@pentible/eslint-config-storybook";
import { pentibleEslintConfigPrettier } from "@pentible/eslint-config-prettier";
import { defineConfig } from "eslint/config";

const config = defineConfig([
    relativeIgnoreFile(".gitignore", import.meta.url),
    pentibleEslintConfig,
    pentibleEslintConfigStorybook,
    pentibleEslintConfigPrettier,
]);

export default config;
```
