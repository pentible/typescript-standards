import execa from "execa";
import { PackageFeature } from "../context/PackageFeature";
import { Component } from "./Component";
import type { PackageContext } from "src/context/PackageContext";

export class EsbuildComponent extends Component {
    matches({ features }: PackageContext) {
        return features.includes(PackageFeature.Esbuild);
    }
    async apply() {
        // TODO: don't install if insideMonorepo and root has esbuild as a devDependency
        await execa.command("npm install -D esbuild");
    }
}
