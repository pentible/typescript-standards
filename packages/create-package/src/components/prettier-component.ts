import { writeFile } from "fs/promises";
import { execaCommand } from "execa";
import { Component } from "#src/components/component";
import type { PackageContext } from "#src/context/package-context";
import type { Formatter } from "#src/formatting/formatter";

export class PrettierComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply(_: PackageContext, formatter: Formatter) {
        await execaCommand("npm install -D prettier@3 @pentible/prettier");

        const prettierrc = "@pentible/prettier";

        await writeFile(".prettierrc", formatter.json(prettierrc));
    }
}
