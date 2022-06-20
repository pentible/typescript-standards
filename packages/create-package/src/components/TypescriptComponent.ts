import { readFile, writeFile } from "fs/promises";
import { join, relative } from "path";
import merge from "deepmerge";
import { execaCommand } from "execa";
import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";
import PackageType from "~/src/context/PackageType";

// TODO: consider a stricter type
type Tsconfig = Record<
    string,
    | Record<
          string,
          | Record<string, string[] | boolean | string>
          | string[]
          | boolean
          | string
      >
    | Record<string, string>[]
    | string[]
    | boolean
    | string
>;

export default class TypescriptComponent extends Component {
    matches() {
        return true;
    }
    async apply({ directory, type, insideMonorepo }: PackageContext) {
        const partials: Tsconfig[] = [
            {
                extends: "@pentible/tsconfig",
            },
        ];

        if (type === PackageType.Monorepo) {
            partials.push({
                include: [],
                references: [],
            });
        }

        // TODO: if parcel
        // partials.push({
        //     compilerOptions: {
        //         baseUrl: ".",
        //         paths: {
        //             "~*": ["./*"],
        //         },
        //     },
        // });

        if (insideMonorepo) {
            // TODO: make more flexible
            const monorepoDirectory = "../../";
            const monorepoTsconfigPath = join(
                monorepoDirectory,
                "tsconfig.json",
            );
            // TODO: make safer
            // - only warn if file doesn't exist(WARN: can't find root tsconfig)
            // - similar if file exists but can't be parsed
            // TODO: switch to jsonc for parsing/stringify'ing
            const monorepoTsconfig: Tsconfig = JSON.parse(
                await readFile(monorepoTsconfigPath, "utf8"),
            ) as unknown as Tsconfig;
            const packageFolder = relative(monorepoDirectory, directory);

            const monorepoTsconfigPartials: Tsconfig[] = [
                monorepoTsconfig,
                {
                    references: [{ path: `./${packageFolder}` }],
                },
            ];
            const tsconfig = merge.all(monorepoTsconfigPartials);
            const indent = 4;
            const json = JSON.stringify(tsconfig, undefined, indent); // TODO: extract?

            await writeFile(monorepoTsconfigPath, json);
        }

        // install in root
        if (!insideMonorepo) {
            await execaCommand("npm i -D typescript@4 @pentible/tsconfig");
        }

        if (partials.length > 0) {
            const tsconfig = merge.all(partials);
            const indent = 4;
            const json = JSON.stringify(tsconfig, undefined, indent); // TODO: extract?

            // TODO: likely need version inside monorepos for overriding certain env/etc
            await writeFile("tsconfig.json", json);
        }
    }
}
