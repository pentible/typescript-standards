import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";
import { writeFile } from "fs/promises";
import { stringify } from "ini";

export default class NpmrcComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply() {
        // TODO: exclude auth token for private (non-monorepo type) packages
        const npmrc = {
            "save-exact": true,
            "//registry.npmjs.org/:_authToken": "${NPM_TOKEN}",
        };

        const ini = stringify(npmrc, {
            whitespace: true,
        });

        await writeFile(".npmrc", ini);
    }
}
