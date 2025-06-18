# eslint-config-node

## usage

- `npm i -D @pentible/eslint-config @pentible/eslint-config-node @pentible/eslint-config-prettier`

- `eslint.config.mjs`

```js
import {
    pentibleEslintConfig,
    relativeIgnoreFile,
} from "@pentible/eslint-config";
import { pentibleEslintConfigNode } from "@pentible/eslint-config-node";
import { pentibleEslintConfigPrettier } from "@pentible/eslint-config-prettier";
import { defineConfig } from "eslint/config";

const config = defineConfig([
    relativeIgnoreFile(".gitignore", import.meta.url),
    pentibleEslintConfig,
    pentibleEslintConfigNode,
    pentibleEslintConfigPrettier,
]);

export default config;
```
