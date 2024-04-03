/** @type {import("prettier").Config} */
const config = {
    proseWrap: "always",
    plugins: ["prettier-plugin-packagejson", "prettier-plugin-sh"],
};

export default config;
