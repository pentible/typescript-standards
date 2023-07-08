import { execa, execaCommand } from "execa";
import { Component } from "./component";
import type { PackageContext } from "~/context/package-context";
import { PackageType } from "~/context/package-type";

export class HuskyComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    private async addPreCommitCommand(command: string) {
        await execa("npx", ["husky", "add", ".husky/pre-commit", command]);
    }
    async apply({ type }: PackageContext) {
        await execaCommand("npm i -D husky@7");

        // TODO: only creates .husky if inside a git dir, maybe we should just automatically git init?
        await execaCommand("npm run prepare");
        await this.addPreCommitCommand("npx check-package-lock");
        await this.addPreCommitCommand(
            type === PackageType.Monorepo ? "npx tsc -b" : "npx tsc --noEmit",
        );
        await this.addPreCommitCommand("npx lint-staged");
    }
}
