import { execa } from "execa";
import { PackageFeature } from "../context/package-feature";
import { Component } from "./component";
import type { PackageContext } from "~/context/package-context";

export class ReactComponent extends Component {
    matches({ features }: PackageContext) {
        return features.includes(PackageFeature.React);
    }
    async apply() {
        const dependencies = ["react@17", "react-dom@17", "react-router-dom@6"];

        const devDependencies = [
            "@types/react@17",
            "@types/react-dom@17",
            "@types/react-router-dom@5",
        ];

        await execa("npm", ["install", ...dependencies]);
        await execa("npm", ["install", "-D", ...devDependencies]);
    }
}
