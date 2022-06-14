import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";
import PackageType from "~/src/context/PackageType";
import { writeFile } from "fs/promises";
import { execaCommand } from "execa";

export default class JestComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply({ type }: PackageContext) {
        await execaCommand(
            "npm i -D jest@28 @types/jest@28 @pentible/jest @pentible/jest-silent",
        );

        const preset =
            type === PackageType.Monorepo
                ? "@pentible/jest/monorepo"
                : "@pentible/jest";

        const jestConfig = {
            preset,
        };
        const json = JSON.stringify(jestConfig, undefined, 4); // TODO: extract?

        await writeFile("jest.config.json", json);
    }
}
