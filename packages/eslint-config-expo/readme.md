# eslint-config-expo

## usage

- `npm i -D @pentible/eslint-config @pentible/eslint-config-react @pentible/eslint-config-expo @pentible/eslint-config-prettier`

- `eslint.config.mjs`

```js
import {
    pentibleEslintConfig,
    relativeIgnoreFile,
} from "@pentible/eslint-config";
import { pentibleEslintConfigReact } from "@pentible/eslint-config-react";
import { pentibleEslintConfigExpo } from "@pentible/eslint-config-expo";
import { pentibleEslintConfigPrettier } from "@pentible/eslint-config-prettier";
import { defineConfig } from "eslint/config";

const config = defineConfig([
    relativeIgnoreFile(".gitignore", import.meta.url),
    pentibleEslintConfig,
    pentibleEslintConfigReact,
    pentibleEslintConfigExpo,
    pentibleEslintConfigPrettier,
]);

export default config;
```
