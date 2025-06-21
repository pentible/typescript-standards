# eslint-config-next

## usage

- `npm i -D @pentible/eslint-config @pentible/eslint-config-node @pentible/eslint-config-web @pentible/eslint-config-react @pentible/eslint-config-next @pentible/eslint-config-prettier`

- `eslint.config.mjs`

```js
import { pentible, relativeIgnoreFile } from "@pentible/eslint-config";
import { pentibleNode } from "@pentible/eslint-config-node";
import { pentibleWeb } from "@pentible/eslint-config-web";
import { pentibleReact } from "@pentible/eslint-config-react";
import { pentibleNext } from "@pentible/eslint-config-next";
import { pentiblePrettier } from "@pentible/eslint-config-prettier";
import { defineConfig } from "eslint/config";

const config = defineConfig([
    relativeIgnoreFile(".gitignore", import.meta.url),
    pentible,
    pentibleNode,
    pentibleWeb,
    pentibleReact,
    pentibleNext,
    pentiblePrettier,
]);

export default config;
```
