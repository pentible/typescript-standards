import { execa } from "execa";
import { PackageFeature } from "../context/package-feature";
import { Component } from "./component";
import type { PackageContext } from "~/context/package-context";

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
