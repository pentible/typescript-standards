import { writeFile } from "fs/promises";
import type { Formatter } from "../formatting/formatter";
import { Component } from "./component";
import type { PackageContext } from "~/context/package-context";

export class NpmrcComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply(_: PackageContext, formatter: Formatter) {
        // TODO: exclude auth token for private (non-monorepo type) packages
        const npmrc = {
            "save-exact": true,
            "//registry.npmjs.org/:_authToken": "${NPM_TOKEN}",
        };

        await writeFile(".npmrc", formatter.ini(npmrc));
    }
}
