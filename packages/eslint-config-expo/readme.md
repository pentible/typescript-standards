# eslint-config-expo

## usage

- `npm i -D @pentible/eslint-config @pentible/eslint-config-react @pentible/eslint-config-expo @pentible/eslint-config-prettier`

- `eslint.config.mjs`

```js
import { pentible, relativeIgnoreFile } from "@pentible/eslint-config";
import { pentibleReact } from "@pentible/eslint-config-react";
import { pentibleExpo } from "@pentible/eslint-config-expo";
import { pentiblePrettier } from "@pentible/eslint-config-prettier";
import { defineConfig } from "eslint/config";

const config = defineConfig([
    relativeIgnoreFile(".gitignore", import.meta.url),
    pentible,
    pentibleReact,
    pentibleExpo,
    pentiblePrettier,
]);

export default config;
```
