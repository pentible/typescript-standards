import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";
import { execaCommand } from "execa";
import { writeFile } from "fs/promises";
import merge from "deepmerge";
import PackageType from "~/src/context/PackageType";

// TODO: consider a stricter type
type Tsconfig = Record<
    string,
    | boolean
    | string
    | string[]
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
    async apply({ type, insideMonorepo }: PackageContext) {
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
