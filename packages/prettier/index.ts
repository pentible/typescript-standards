import type { Config } from "prettier";

const config = {
    proseWrap: "always",
    plugins: ["prettier-plugin-packagejson", "prettier-plugin-sh"],
} satisfies Config;

// NOTE: prettier expects a default export
// eslint-disable-next-line import-x/no-default-export
export default config;
