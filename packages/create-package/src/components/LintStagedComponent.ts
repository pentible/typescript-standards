import { writeFile } from "fs/promises";
import { execaCommand } from "execa";
import { stringify } from "yaml";
import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";

export default class LintStagedComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply() {
        await execaCommand("npm i -D lint-staged@12");

        const lintStaged = {
            "*": ["prettier --check --ignore-unknown"],
            "*.{js,ts,jsx,tsx}": ["eslint"],
            "*.sh": ["shellcheck --color=always"],
        };

        const yaml = stringify(lintStaged);

        await writeFile(".lintstagedrc.yml", yaml);
    }
}
