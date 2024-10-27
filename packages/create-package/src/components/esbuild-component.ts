import { execaCommand } from "execa";
import { Component } from "#src/components/component";
import type { PackageContext } from "#src/context/package-context";
import { PackageFeature } from "#src/context/package-feature";

export class EsbuildComponent extends Component {
    matches({ features }: PackageContext) {
        return features.includes(PackageFeature.Esbuild);
    }
    async apply() {
        // TODO: don't install if insideMonorepo and root has esbuild as a devDependency
        await execaCommand("npm install -D esbuild");
    }
}
