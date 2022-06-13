import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";
import { execa, execaCommand } from "execa";

export default class HuskyComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async addPreCommitCommand(command: string) {
        await execa("npx", ["husky", "add", ".husky/pre-commit", command]);
    }
    async apply() {
        await execaCommand("npm i -D husky@7");

        await execaCommand("npm run prepare");
        await this.addPreCommitCommand("npx tsc --noEmit");
        await this.addPreCommitCommand("npx lint-staged");
    }
}
