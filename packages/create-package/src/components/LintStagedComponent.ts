import { writeFile } from "fs/promises";
import { execaCommand } from "execa";
import type { Formatter } from "../formatting/Formatter";
import { Component } from "./Component";
import type { PackageContext } from "src/context/PackageContext";

export class LintStagedComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply(_: PackageContext, formatter: Formatter) {
        await execaCommand("npm i -D lint-staged@12");

        const lintStaged = {
            "*": [
                "prettier --check --ignore-unknown",
                "shellcheck-all --color=always",
            ],
            "*.{js,ts,jsx,tsx,cjs}": ["eslint"],
        };

        await writeFile(".lintstagedrc.yml", formatter.yaml(lintStaged));
    }
}
