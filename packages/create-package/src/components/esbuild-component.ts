import { execaCommand } from "execa";
import { PackageFeature } from "../context/package-feature";
import { Component } from "./component";
import type { PackageContext } from "src/context/package-context";

export class EsbuildComponent extends Component {
    matches({ features }: PackageContext) {
        return features.includes(PackageFeature.Esbuild);
    }
    async apply() {
        // TODO: don't install if insideMonorepo and root has esbuild as a devDependency
        await execaCommand("npm install -D esbuild");
    }
}
