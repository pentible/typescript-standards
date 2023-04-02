import { writeFile } from "fs/promises";
import { execaCommand } from "execa";
import type { Formatter } from "../formatting/formatter";
import { Component } from "./component";
import type { PackageContext } from "src/context/package-context";

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
            "*.{js,ts,jsx,tsx}": ["eslint"],
        };

        await writeFile(".lintstagedrc.yml", formatter.yaml(lintStaged));
    }
}
