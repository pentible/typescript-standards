import { writeFile } from "fs/promises";
import execa from "execa";
import type { Formatter } from "../formatting/Formatter";
import { Component } from "./Component";
import type { PackageContext } from "src/context/PackageContext";

export class PrettierComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply(_: PackageContext, formatter: Formatter) {
        await execa.command("npm install -D prettier@2 @pentible/prettier");

        const prettierrc = "@pentible/prettier";

        await writeFile(".prettierrc", formatter.json(prettierrc));
    }
}
