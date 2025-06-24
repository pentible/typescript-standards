# prettier

## usage

- `npm i -D @pentible/prettier`

- `prettier.config.mjs`

```js
export { default } from "@pentible/prettier";

// OR if you need to override settings
import pentible from "@pentible/prettier";

/** @satisfies {import("prettier").Config} */
const config = {
    ...pentible,
    plugins: [...pentible.plugins, "prettier-plugin-tailwindcss"],
};

export default config;
```
