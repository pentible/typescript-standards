import { readFile, writeFile } from "fs/promises";
import { join, relative } from "path";
import merge from "deepmerge";
import { execaCommand } from "execa";
import { Component } from "./component";
import type { PackageContext } from "~/context/package-context";
import { PackageType } from "~/context/package-type";
import type { Formatter } from "~/formatting/formatter";

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

export class TypescriptComponent extends Component {
    matches() {
        return true;
    }
    async apply(
        { directory, type, insideMonorepo }: PackageContext,
        formatter: Formatter,
    ) {
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

        if (![PackageType.Monorepo, PackageType.Config].includes(type)) {
            partials.push({
                compilerOptions: {
                    baseUrl: ".",
                },
            });
        }

        if (![PackageType.Monorepo].includes(type)) {
            partials.push({
                compilerOptions: {
                    outDir: "dist",
                },
            });
        }

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

            await writeFile(monorepoTsconfigPath, formatter.json(tsconfig));
        }

        // install in root
        if (!insideMonorepo) {
            await execaCommand("npm i -D typescript@4 @pentible/tsconfig");
        }

        if (partials.length > 0) {
            const tsconfig = merge.all(partials);

            // TODO: likely need version inside monorepos for overriding certain env/etc
            await writeFile("tsconfig.json", formatter.json(tsconfig));
        }
    }
}
