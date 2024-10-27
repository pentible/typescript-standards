import { writeFile } from "fs/promises";
import { Component } from "#src/components/component";
import type { PackageContext } from "#src/context/package-context";
import type { Formatter } from "#src/formatting/formatter";

export class NpmrcComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply(_: PackageContext, formatter: Formatter) {
        // TODO: exclude auth token for private (non-monorepo type) packages
        const npmrc = {
            "prefer-dedupe": true,
            "save-exact": true,
            audit: false,
            "//registry.npmjs.org/:_authToken": "${NPM_TOKEN}",
        };

        await writeFile(".npmrc", formatter.ini(npmrc));
    }
}
