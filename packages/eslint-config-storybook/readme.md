# eslint-config-storybook

## usage

- `npm i -D @pentible/eslint-config @pentible/eslint-config-storybook @pentible/eslint-config-prettier`

- `eslint.config.mjs`

```js
import { pentible, relativeIgnoreFile } from "@pentible/eslint-config";
import { pentibleStorybook } from "@pentible/eslint-config-storybook";
import { pentiblePrettier } from "@pentible/eslint-config-prettier";
import { defineConfig } from "eslint/config";

const config = defineConfig([
    relativeIgnoreFile(".gitignore", import.meta.url),
    pentible,
    pentibleStorybook,
    pentiblePrettier,
]);

export default config;
```
