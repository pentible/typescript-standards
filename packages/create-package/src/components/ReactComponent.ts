import { execa } from "execa";
import PackageFeature from "../context/PackageFeature";
import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";

export default class ReactComponent extends Component {
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
