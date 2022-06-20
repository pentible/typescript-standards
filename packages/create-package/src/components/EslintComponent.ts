import { writeFile } from "fs/promises";
import merge from "deepmerge";
import { execaCommand } from "execa";
import { stringify } from "yaml";
import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";
import PackageType from "~/src/context/PackageType";

// TODO: consider a stricter type
type Eslintrc = Record<
    string,
    Record<string, boolean | string> | boolean | string
>;

export default class EslintComponent extends Component {
    matches() {
        return true;
    }
    private env(type: PackageType): Record<string, true> {
        switch (type) {
            case PackageType.Web:
                return {
                    browser: true,
                };
            case PackageType.Node:
            case PackageType.Config:
                return {
                    node: true,
                };
            case PackageType.Library:
                return {
                    "shared-node-browser": true,
                };
            case PackageType.Monorepo:
                return {}; // unlikely to be any special requirements
            case PackageType.WebExtension:
                return {
                    browser: true,
                    webextensions: true,
                };
            case PackageType.Electron:
                return {
                    // TODO: not actually sure what's most appropriate...
                    "shared-node-browser": true,
                };
        }
    }
    async apply({ type, insideMonorepo }: PackageContext) {
        const partials: Eslintrc[] = [];

        if (!insideMonorepo) {
            partials.push({
                root: true,
                extends: "@pentible/eslint-config",
            });
        }

        // TODO: hmm web vs react... could be based on react feature, but that may be messy
        // extends: "@pentible/eslint-config/react",

        partials.push({
            env: this.env(type),
        });

        // install in root
        if (!insideMonorepo) {
            await execaCommand("npm install -D @pentible/eslint-config");
        }

        if (partials.length > 0) {
            const eslintrc = merge.all(partials);
            const yaml = stringify(eslintrc);

            await writeFile(".eslintrc.yml", yaml);
        }
    }
}
