import { writeFile } from "fs/promises";
import { execaCommand } from "execa";
import type { Formatter } from "../formatting/formatter";
import { Component } from "./component";
import type { PackageContext } from "~/context/package-context";

export class PrettierComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply(_: PackageContext, formatter: Formatter) {
        await execaCommand("npm install -D prettier@2 @pentible/prettier");

        const prettierrc = "@pentible/prettier";

        await writeFile(".prettierrc", formatter.json(prettierrc));
    }
}
