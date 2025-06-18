# eslint-config-react

## usage

- `npm i -D @pentible/eslint-config @pentible/eslint-config-web @pentible/eslint-config-react @pentible/eslint-config-prettier`

- `eslint.config.mjs`

```js
import {
    pentibleEslintConfig,
    relativeIgnoreFile,
} from "@pentible/eslint-config";
import { pentibleEslintConfigWeb } from "@pentible/eslint-config-web";
import { pentibleEslintConfigReact } from "@pentible/eslint-config-react";
import { pentibleEslintConfigPrettier } from "@pentible/eslint-config-prettier";
import { defineConfig } from "eslint/config";

const config = defineConfig([
    relativeIgnoreFile(".gitignore", import.meta.url),
    pentibleEslintConfig,
    pentibleEslintConfigWeb,
    pentibleEslintConfigReact,
    pentibleEslintConfigPrettier,
]);

export default config;
```
