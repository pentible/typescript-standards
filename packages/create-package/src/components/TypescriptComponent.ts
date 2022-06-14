import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";
import { execaCommand } from "execa";
import { readFile, writeFile } from "fs/promises";
import merge from "deepmerge";
import PackageType from "~/src/context/PackageType";
import { join, relative } from "path";

// TODO: consider a stricter type
type Tsconfig = Record<
    string,
    | boolean
    | string
    | string[]
    | Record<string, string>[]
    | Record<
          string,
          | boolean
          | string
          | string[]
          | Record<string, boolean | string | string[]>
      >
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const monorepoTsconfig: Tsconfig = JSON.parse(
                await readFile(monorepoTsconfigPath, "utf8"),
            );
            const packageFolder = relative(monorepoDirectory, directory);

            const monorepoTsconfigPartials: Tsconfig[] = [
                monorepoTsconfig,
                {
                    references: [{ path: `./${packageFolder}` }],
                },
            ];
            const tsconfig = merge.all(monorepoTsconfigPartials);
            const json = JSON.stringify(tsconfig, undefined, 4); // TODO: extract?

            await writeFile(monorepoTsconfigPath, json);
        }

        // install in root
        if (!insideMonorepo) {
            await execaCommand("npm i -D typescript@4 @pentible/tsconfig");
        }

        if (partials.length > 0) {
            const tsconfig = merge.all(partials);
            const json = JSON.stringify(tsconfig, undefined, 4); // TODO: extract?

            // TODO: likely need version inside monorepos for overriding certain env/etc
            await writeFile("tsconfig.json", json);
        }
    }
}
