# eslint-config-prettier

## usage

- `npm i -D @pentible/eslint-config @pentible/eslint-config-prettier`

- `eslint.config.mjs`

```js
import { pentible, relativeIgnoreFile } from "@pentible/eslint-config";
import { pentiblePrettier } from "@pentible/eslint-config-prettier";
import { defineConfig } from "eslint/config";

const config = defineConfig([
    relativeIgnoreFile(".gitignore", import.meta.url),
    pentible,
    pentiblePrettier,
]);

export default config;
```
