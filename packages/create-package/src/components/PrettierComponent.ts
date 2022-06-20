import { writeFile } from "fs/promises";
import { execaCommand } from "execa";
import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";

export default class PrettierComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply() {
        await execaCommand("npm install -D prettier@2 @pentible/prettier");

        const prettierrc = "@pentible/prettier";
        const indent = 4;
        const json = JSON.stringify(prettierrc, undefined, indent); // TODO: extract?

        await writeFile(".prettierrc", json);
    }
}
