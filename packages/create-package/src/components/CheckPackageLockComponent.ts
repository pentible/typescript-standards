import { execaCommand } from "execa";
import { Component } from "./Component";
import type { PackageContext } from "src/context/PackageContext";

export class CheckPackageLockComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply() {
        await execaCommand("npm install -D @pentible/check-package-lock");
    }
}
