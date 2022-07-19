import { writeFile } from "fs/promises";
import merge from "deepmerge";
import { execaCommand } from "execa";
import { PackageFeature } from "../context/PackageFeature";
import type { Formatter } from "../formatting/Formatter";
import { Component } from "./Component";
import { PackageAccessLevel } from "~/src/context/PackageAccessLevel";
import type { PackageContext } from "~/src/context/PackageContext";
import { PackageType } from "~/src/context/PackageType";

// TODO: consider a stricter type
type PackageJson = Record<string, Record<string, string> | string[] | string>;

export class PackageJsonComponent extends Component {
    matches() {
        return true;
    }
    basePartial({ scope, name, license }: PackageContext): PackageJson {
        return {
            name: scope ? `${scope}/${name}` : name,
            version: "0.0.0",
            license,
            type: "module",
            scripts: {},
        };
    }
    rootPartial({ insideMonorepo }: PackageContext): PackageJson {
        if (insideMonorepo) {
            return {};
        }

        const scripts = {
            // TODO: should consider pulling this out to a script file
            lint: [
                "check-package-lock",
                "shellcheck-all",
                "tsc --noEmit",
                "eslint .",
                "prettier --loglevel warn --check .",
            ].join(" && "),
            "lint:fix": "eslint --fix . && prettier --loglevel warn --write .",
            prepare: "husky install",
            test: "jest",
            "test:watch": "jest --watch",
        };

        return {
            scripts,
        };
    }
    accessPartial({
        access,
        author,
        description,
        repository,
    }: PackageContext): PackageJson {
        if (access === PackageAccessLevel.Private) {
            return {
                private: "true",
            };
        } else {
            return {
                publishConfig: {
                    access,
                },
                description: description ?? "",
                repository: {
                    type: "git",
                    url: repository ?? "",
                },
                author: author ?? "",
            };
        }
    }
    typePartial({ type, name, features }: PackageContext): PackageJson {
        const engines = {
            node: "^16.14.2",
        };

        switch (type) {
            case PackageType.Web:
                return {
                    main: "./dist/index.js",
                    source: features.includes(PackageFeature.React)
                        ? "./src/index.tsx"
                        : "./src/index.ts",
                };
            case PackageType.Node:
                return {
                    main: "./dist/index.js",
                    source: "./src/index.ts",
                    bin: {
                        [name]: "./dist/index.js",
                    },
                    files: ["dist/index.js"],
                    engines,
                    scripts: {
                        start: "ts-node --transpileOnly ./src/index.ts",
                    },
                };
            case PackageType.Library:
                return {
                    main: "./dist/index.js",
                    source: "./src/index.ts",
                    // TODO: consider: "exports": {
                    //   ".": "./index.ts"
                    // },
                    files: ["dist/index.js"],
                    engines,
                };
            case PackageType.Monorepo:
                return {
                    workspaces: ["./packages/*"],
                };
            case PackageType.WebExtension:
                return {
                    source: "manifest.json",
                };
            case PackageType.Electron:
                return {
                    // TODO: figure out
                };
            case PackageType.Config:
                return {
                    exports: {
                        ".": "./index.js",
                    },
                    engines,
                };
        }
    }
    parcelStartScript(type: PackageType): PackageJson {
        switch (type) {
            case PackageType.WebExtension:
                return { start: "parcel watch" };
            case PackageType.Web:
                return { start: "parcel serve" };
            default:
                return {};
        }
    }
    parcelPartial({ type, features }: PackageContext): PackageJson {
        if (!features.includes(PackageFeature.Parcel)) {
            return {};
        }

        return {
            scripts: {
                ...this.parcelStartScript(type),
                build: "parcel build",
                watch: "parcel watch",
            },
        };
    }
    async apply(ctx: PackageContext, formatter: Formatter) {
        const { insideMonorepo } = ctx;

        const packageJson = merge.all([
            this.basePartial(ctx),
            this.rootPartial(ctx),
            this.accessPartial(ctx),
            this.typePartial(ctx),
            this.parcelPartial(ctx),
        ]);

        await writeFile("package.json", formatter.json(packageJson));

        const rootDirectory = this.getRootDirectory(insideMonorepo);
        await execaCommand("npm install --ignore-scripts", {
            cwd: rootDirectory,
        });
    }
}
