import { execa } from "execa";
import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";

export default class LintFixComponent extends Component {
    matches() {
        return true;
    }

    async apply({ insideMonorepo }: PackageContext) {
        const rootDirectory = this.getRootDirectory(insideMonorepo);
        await execa("npx", [
            "prettier",
            "--loglevel",
            "warn",
            "--write",
            rootDirectory,
        ]);
    }
}
