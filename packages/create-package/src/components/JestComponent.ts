import { writeFile } from "fs/promises";
import { execaCommand } from "execa";
import type Formatter from "../formatting/Formatter";
import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";
import PackageType from "~/src/context/PackageType";

export default class JestComponent extends Component {
    matches() {
        return true;
    }
    async apply(
        { type, insideMonorepo }: PackageContext,
        formatter: Formatter,
    ) {
        if (!insideMonorepo) {
            await execaCommand(
                "npm i -D jest@28 @pentible/jest @pentible/jest-silent @types/jest",
            );
        }

        const preset =
            type === PackageType.Monorepo
                ? "@pentible/jest/monorepo"
                : "@pentible/jest";

        // TODO: parcel feature:
        // moduleNameMapper: {
        //     "^~/(.*)$": "<rootDir>/$1"
        // }

        const jestConfig = {
            preset,
        };

        await writeFile("jest.config.json", formatter.json(jestConfig));
    }
}
