import { execaCommand } from "execa";
import { Component } from "./component";
import type { PackageContext } from "src/context/package-context";

export class ShellcheckAllComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply() {
        await execaCommand("npm install -D @pentible/shellcheck-all");
    }
}
