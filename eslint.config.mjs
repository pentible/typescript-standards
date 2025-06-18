import {
    pentibleEslintConfig,
    relativeIgnoreFile,
} from "@pentible/eslint-config";
import { pentibleEslintConfigNode } from "@pentible/eslint-config-node";
import { pentibleEslintConfigPrettier } from "@pentible/eslint-config-prettier";
import { defineConfig } from "eslint/config";

const config = defineConfig([
    relativeIgnoreFile(".gitignore", import.meta.url),
    pentibleEslintConfig,
    pentibleEslintConfigPrettier,
    {
        files: ["packages/create-package/**"],
        extends: [pentibleEslintConfigNode],
    },
]);

export default config;
