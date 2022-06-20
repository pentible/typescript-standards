import { writeFile } from "fs/promises";
import { join } from "path";
import merge from "deepmerge";
import Component from "./Component";
import PackageAccessLevel from "~/src/context/PackageAccessLevel";
import type PackageContext from "~/src/context/PackageContext";
import PackageType from "~/src/context/PackageType";

// TODO: consider a stricter type
type PackageJson = Record<string, Record<string, string> | string[] | string>;

export default class PackageJsonComponent extends Component {
    matches() {
        return true;
    }

    async apply({
        directory,
        name,
        scope,
        type,
        access,
        insideMonorepo,
        license,
        author,
        description,
        repository,
    }: PackageContext) {
        const partials: PackageJson[] = [
            {
                name: scope ? `${scope}/${name}` : name,
                version: "0.0.0",
                scripts: {},
                license,
            },
        ];

        // TODO: consider sub-components, overlays or something to clean this up
        // TODO: maybe instead of writing to disk we have in memory state representing
        // the hierarchy and additional components can handle customizations to package.json

        if (!insideMonorepo) {
            partials.push({
                scripts: {
                    // TODO: should consider pulling this out to a script file
                    lint: [
                        "check-package-lock",
                        "shellcheck-all",
                        "tsc --noEmit",
                        "eslint .",
                        "prettier --loglevel warn --check .",
                    ].join(" && "),
                    "lint:fix":
                        "eslint --fix . && prettier --loglevel warn --write .",
                    prepare: "husky install",
                    test: "jest",
                    "test:watch": "jest --watch",
                },
            });
        }

        // // TODO: if parcel? or maybe we should modify package.json in ParcelComponent?
        // scripts["build"] = "parcel build";
        // scripts["watch"] = "parcel watch";
        // scripts["start"] =
        // - web-ext: parcel watch --no-autoinstall
        // - node: ts-node --transpileOnly ./src/index.ts
        // - else: parcel serve --no-autoinstall

        if (access === PackageAccessLevel.Private) {
            partials.push({
                private: "true",
            });
        } else {
            partials.push({
                publishConfig: {
                    access,
                },
                description: description ?? "",
                repository: {
                    type: "git",
                    url: repository ?? "",
                },
                author: author ?? "",
            });
        }

        if (type === PackageType.Monorepo) {
            partials.push({
                workspaces: ["./packages/*"],
            });
        }

        const packageJson = merge.all(partials);

        // write
        const indent = 4;
        const json = JSON.stringify(packageJson, undefined, indent); // TODO: extract?
        const path = join(directory, "package.json"); // TODO: not required?

        await writeFile(path, json);

        // TODO: refactor to something more like:
        // await writer.write("package.json", formatter.json(packageJson))
    }
}
