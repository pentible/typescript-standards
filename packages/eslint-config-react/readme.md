# eslint-config-react

## usage

- `npm i -D @pentible/eslint-config @pentible/eslint-config-web @pentible/eslint-config-react @pentible/eslint-config-prettier`

- `eslint.config.mjs`

```js
import { pentible, relativeIgnoreFile } from "@pentible/eslint-config";
import { pentibleWeb } from "@pentible/eslint-config-web";
import { pentibleReact } from "@pentible/eslint-config-react";
import { pentiblePrettier } from "@pentible/eslint-config-prettier";
import { defineConfig } from "eslint/config";

const config = defineConfig([
    relativeIgnoreFile(".gitignore", import.meta.url),
    pentible,
    pentibleWeb,
    pentibleReact,
    pentiblePrettier,
]);

export default config;
```
