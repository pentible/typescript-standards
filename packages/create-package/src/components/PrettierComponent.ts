import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";
import { execaCommand } from "execa";
import { writeFile } from "fs/promises";

export default class PrettierComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply() {
        await execaCommand("npm install -D prettier@2 @pentible/prettier");

        const prettierrc = "@pentible/prettier";
        const json = JSON.stringify(prettierrc, undefined, 4); // TODO: extract?

        await writeFile(".prettierrc", json);
    }
}
