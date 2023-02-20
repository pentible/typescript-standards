import { writeFile } from "fs/promises";
import merge from "deepmerge";
import { execa, execaCommand } from "execa";
import { PackageFeature } from "../context/package-feature";
import type { Formatter } from "../formatting/formatter";
import type { PackageContext } from "src/context/package-context";
import { PackageType } from "src/context/package-type";
import { Component } from "./component";

// TODO: consider a stricter type
type Eslintrc = Record<
    string,
    Record<string, boolean | string> | string[] | boolean | string | undefined
>;

export class EslintComponent extends Component {
    matches() {
        return true;
    }
    private env(type: PackageType): Record<string, true> | undefined {
        switch (type) {
            case PackageType.Web:
            case PackageType.Node:
            case PackageType.Config:
            case PackageType.Monorepo:
                return undefined; // handled by @pentible/eslint-config-*
            case PackageType.Library:
                return {
                    "shared-node-browser": true,
                };
            case PackageType.WebExtension:
                return {
                    webextensions: true,
                };
            case PackageType.Electron:
                return {
                    // TODO: not actually sure what's most appropriate...
                    "shared-node-browser": true,
                };
        }
    }
    private configs(
        type: PackageType,
        features: PackageFeature[],
        insideMonorepo: boolean,
    ): string[] {
        const configs: string[] = [];

        // type configs
        switch (type) {
            case PackageType.Web:
            case PackageType.WebExtension:
                configs.push("@pentible/eslint-config-web");
                break;
            case PackageType.Node:
            case PackageType.Config:
                configs.push("@pentible/eslint-config-node");
                break;
            case PackageType.Library:
                break; // TODO: likely will end up with a @pentible/eslint-config-library config
            case PackageType.Electron:
                break; // TODO: figure out what makes sense
            case PackageType.Monorepo:
                break; // unlikely to be any special requirements
        }

        // feature configs
        if (features.includes(PackageFeature.React)) {
            configs.push("@pentible/eslint-config-react");
        }

        // prettier (to override other configs, or root config)
        if (configs.length > 0 || !insideMonorepo) {
            configs.push("@pentible/eslint-config-prettier");
        }

        return configs;
    }
    async apply(
        { type, features, insideMonorepo }: PackageContext,
        formatter: Formatter,
    ) {
        const partials: Eslintrc[] = [];

        if (!insideMonorepo) {
            partials.push({
                root: true,
                extends: ["@pentible/eslint-config"],
            });
        }

        const configs = this.configs(type, features, insideMonorepo);
        if (configs.length > 0) {
            partials.push({
                extends: configs,
            });
        }

        partials.push({
            env: this.env(type),
        });

        if (partials.length > 0) {
            const eslintrc = merge.all(partials);

            await writeFile(".eslintrc.yml", formatter.yaml(eslintrc));
        }

        // install in root
        if (!insideMonorepo) {
            await execaCommand("npm install -D @pentible/eslint-config");
        }

        // additional configs can start out as package specific (or root if not in a monorepo of course)
        if (configs.length > 0) {
            await execa("npm", ["install", "-D", ...configs]);
        }
    }
}
