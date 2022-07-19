import { execa, execaCommand } from "execa";
import { Component } from "./Component";
import type { PackageContext } from "~/src/context/PackageContext";

export class HuskyComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    private async addPreCommitCommand(command: string) {
        await execa("npx", ["husky", "add", ".husky/pre-commit", command]);
    }
    async apply() {
        await execaCommand("npm i -D husky@7");

        // TODO: only creates .husky if inside a git dir, maybe we should just automatically git init?
        await execaCommand("npm run prepare");
        await this.addPreCommitCommand("npx check-package-lock");
        await this.addPreCommitCommand("npx tsc --noEmit");
        await this.addPreCommitCommand("npx lint-staged");
        await this.addPreCommitCommand(
            "npx jest-silent --passWithNoTests # TODO: remove --passWithNoTests once tests added",
        );
    }
}
