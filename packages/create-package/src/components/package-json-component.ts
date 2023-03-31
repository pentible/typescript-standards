import { writeFile } from "fs/promises";
import merge from "deepmerge";
import { execaCommand } from "execa";
import { PackageFeature } from "../context/package-feature";
import type { Formatter } from "../formatting/formatter";
import { PackageAccessLevel } from "src/context/package-access-level";
import type { PackageContext } from "src/context/package-context";
import { PackageType } from "src/context/package-type";
import { Component } from "./component";

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
    rootPartial({ insideMonorepo, type }: PackageContext): PackageJson {
        if (insideMonorepo) {
            return {};
        }

        const scripts = {
            // TODO: should consider pulling this out to a script file
            lint: [
                "check-package-lock",
                "shellcheck-all",
                type === PackageType.Monorepo ? "tsc -b" : "tsc --noEmit",
                "eslint .",
                "prettier --loglevel warn --check .",
            ].join(" && "),
            "lint:fix": "eslint --fix . && prettier --loglevel warn --write .",
            prepare: "husky install",
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
    typePartial({ type, name }: PackageContext): PackageJson {
        const engines = {
            node: ">=18",
        };

        switch (type) {
            case PackageType.Web:
                return {
                    main: "./dist/index.js",
                };
            case PackageType.Node:
                return {
                    type: "commonjs",
                    main: "./dist/index.js",
                    source: "./src/index.ts",
                    bin: {
                        [name]: "./dist/index.js",
                    },
                    files: ["dist/index.js"],
                    engines,
                    scripts: {
                        start: "./dist/index.js",
                    },
                };
            case PackageType.Library:
                return {
                    main: "./dist/index.js",
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
                    // NOTE: likely nothing required
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
    esbuildPartial({ features }: PackageContext): PackageJson {
        if (!features.includes(PackageFeature.Esbuild)) {
            return {};
        }

        // TODO: --format=esm once properly supported
        const build =
            "esbuild --bundle --platform=node --target=node18 --minify --outfile=./dist/index.js src/index.ts";

        return {
            scripts: {
                build,
                watch: "npm run build -- --watch",
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
            this.esbuildPartial(ctx),
        ]);

        await writeFile("package.json", formatter.json(packageJson));

        const rootDirectory = this.getRootDirectory(insideMonorepo);
        await execaCommand("npm install --ignore-scripts", {
            cwd: rootDirectory,
        });
    }
}