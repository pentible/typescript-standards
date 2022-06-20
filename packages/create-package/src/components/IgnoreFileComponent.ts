import { writeFile } from "fs/promises";
import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";

export default class IgnoreFileComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply() {
        // TODO: not all applicable, maybe just fine though?
        const ignore = [
            "node_modules",
            "/.parcel-cache/",
            "/packages/*/dist/",
            "/.husky/_/",
            "*.tgz",
            "tsconfig.tsbuildinfo",
        ];

        const contents = ignore.join("\n");

        await writeFile(".gitignore", contents);
        await writeFile(".eslintignore", contents);
        await writeFile(".prettierignore", contents);
    }
}
