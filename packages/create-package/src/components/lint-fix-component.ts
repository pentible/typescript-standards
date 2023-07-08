import { execa } from "execa";
import { Component } from "./component";
import type { PackageContext } from "~/context/package-context";

export class LintFixComponent extends Component {
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
