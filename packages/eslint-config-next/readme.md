# eslint-config-next

## usage

- `npm i -D @pentible/eslint-config @pentible/eslint-config-node @pentible/eslint-config-web @pentible/eslint-config-react @pentible/eslint-config-next @pentible/eslint-config-prettier`

- `eslint.config.mjs`

```js
import {
    pentibleEslintConfig,
    relativeIgnoreFile,
} from "@pentible/eslint-config";
import { pentibleEslintConfigNode } from "@pentible/eslint-config-node";
import { pentibleEslintConfigWeb } from "@pentible/eslint-config-web";
import { pentibleEslintConfigReact } from "@pentible/eslint-config-react";
import { pentibleEslintConfigNext } from "@pentible/eslint-config-next";
import { pentibleEslintConfigPrettier } from "@pentible/eslint-config-prettier";
import { defineConfig } from "eslint/config";

const config = defineConfig([
    relativeIgnoreFile(".gitignore", import.meta.url),
    pentibleEslintConfig,
    pentibleEslintConfigNode,
    pentibleEslintConfigWeb,
    pentibleEslintConfigReact,
    pentibleEslintConfigNext,
    pentibleEslintConfigPrettier,
]);

export default config;
```
