import execa from "execa";
import { Component } from "./Component";
import type { PackageContext } from "~/src/context/PackageContext";

export class ShellcheckAllComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply() {
        await execa.command("npm install -D @pentible/shellcheck-all");
    }
}
