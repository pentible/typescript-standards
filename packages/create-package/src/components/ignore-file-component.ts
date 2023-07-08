import { writeFile } from "fs/promises";
import type { Formatter } from "../formatting/formatter";
import { Component } from "./component";
import type { PackageContext } from "~/context/package-context";

export class IgnoreFileComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply(_: PackageContext, formatter: Formatter) {
        // TODO: not all applicable, maybe just fine though?
        const ignore = [
            "node_modules",
            "/packages/*/dist/",
            "/apps/*/dist/",
            "/.husky/_/",
            "*.tgz",
            "tsconfig.tsbuildinfo",
        ];

        const contents = formatter.lines(ignore);

        await writeFile(".gitignore", contents);
        await writeFile(".eslintignore", contents);
        await writeFile(".prettierignore", contents);
    }
}
