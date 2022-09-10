import execa from "execa";
import { PackageFeature } from "../context/PackageFeature";
import { Component } from "./Component";
import type { PackageContext } from "~/src/context/PackageContext";

export class ChakraUiComponent extends Component {
    matches({ features }: PackageContext) {
        return features.includes(PackageFeature.ChakraUi);
    }
    async apply() {
        const dependencies = [
            "@chakra-ui/react@1",
            "@emotion/react@^11",
            "@emotion/styled@^11",
            "framer-motion@^6",
        ];

        await execa("npm", ["install", ...dependencies]);
    }
}
