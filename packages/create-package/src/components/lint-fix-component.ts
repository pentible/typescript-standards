import { execa } from "execa";
import { Component } from "#src/components/component";
import type { PackageContext } from "#src/context/package-context";

export class LintFixComponent extends Component {
    matches() {
        return true;
    }

    async apply({ insideMonorepo }: PackageContext) {
        const rootDirectory = this.getRootDirectory(insideMonorepo);
        await execa("npx", [
            "prettier",
            "--log-level",
            "warn",
            "--write",
            rootDirectory,
        ]);
    }
}
