import { pentible, relativeIgnoreFile } from "@pentible/eslint-config";
import { pentibleNode } from "@pentible/eslint-config-node";
import { pentiblePrettier } from "@pentible/eslint-config-prettier";
import { defineConfig } from "eslint/config";

const config = defineConfig([
    relativeIgnoreFile(".gitignore", import.meta.url),
    pentible,
    pentiblePrettier,
    {
        files: ["packages/create-package/**"],
        extends: [pentibleNode],
    },
]);

export default config;
