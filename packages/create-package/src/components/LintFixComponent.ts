import Component from "./Component";
import { execa } from "execa";
import type PackageContext from "~src/context/PackageContext";

export default class LintFixComponent extends Component {
    matches() {
        return true;
    }

    getLintDirectory(insideMonorepo: boolean) {
        if (insideMonorepo) {
            // TODO: make more flexible
            return "../../";
        }

        return ".";
    }

    async apply({ insideMonorepo }: PackageContext) {
        const lintDirectory = this.getLintDirectory(insideMonorepo);
        await execa("npx", [
            "prettier",
            "--loglevel",
            "warn",
            "--write",
            lintDirectory,
        ]);
    }
}
