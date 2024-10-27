import { basename } from "path";
import chalk from "chalk";
import { prompt } from "#src/cli/prompt";
import { promptToContinue } from "#src/cli/prompt-to-continue";
import { License } from "#src/context/license";
import { PackageAccessLevel } from "#src/context/package-access-level";
import { PackageContext } from "#src/context/package-context";
import { PackageFeature } from "#src/context/package-feature";
import { PackageType } from "#src/context/package-type";
import { formatGitUrlHttps } from "#src/utility/format-git-url-https";
import type { AsObject } from "#src/utility/types";

const reactPackageTypes = [
    PackageType.Web,
    PackageType.WebExtension,
    PackageType.Electron,
];

type PackageContextAnswers = AsObject<PackageContext>;

export interface PackageContextAssumptions {
    directory: string;
    scope: string | undefined;
    insideMonorepo: boolean;
    repository: string | undefined;
    author: string;
}

function accessLevelDescription(level: PackageAccessLevel) {
    switch (level) {
        case PackageAccessLevel.Private:
            return "private - should not be published to npm";
        case PackageAccessLevel.Restricted:
            return "restricted - publish to an npm organization";
        case PackageAccessLevel.Public:
            return "public - publish publicly to npm";
    }
}

function accessLevelChoice(level: PackageAccessLevel) {
    return {
        name: accessLevelDescription(level),
        value: level,
        short: level,
    };
}

export async function promptPackageContext(
    assumptions: PackageContextAssumptions,
) {
    const answers = await prompt<PackageContextAnswers>([
        {
            type: "input",
            name: "directory",
            message: "Directory:",
            default: assumptions.directory,
            filter(val: string) {
                return val.trim();
            },
            validate: Boolean,
        },
        {
            type: "input",
            name: "name",
            message: "Package name:",
            default(answers: Partial<PackageContextAnswers>) {
                return basename(answers.directory ?? "");
            },
            filter(val: string) {
                return val.trim();
            },
            validate: Boolean,
        },
        {
            type: "input",
            name: "scope",
            message: "Package scope:",
            suffix:
                assumptions.scope != null ? "" : chalk.dim(" (blank for none)"),
            default: assumptions.scope,
            filter(val: string) {
                const scope = val.trim();
                const firstChar = scope[0];

                // either blank or already prefixed
                if (firstChar === undefined || firstChar === "@") {
                    return scope;
                }

                return `@${scope}`;
            },
        },
        {
            type: "list",
            name: "type",
            message: "Package type:",
            choices: Object.values(PackageType),
        },
        {
            type: "checkbox",
            name: "features",
            message: "Features:",
            choices: Object.values(PackageFeature),
            loop: false,
            default({ type }: Pick<PackageContextAnswers, "type">) {
                if (reactPackageTypes.includes(type)) {
                    return [PackageFeature.React, PackageFeature.ChakraUi];
                }

                return [];
            },
        },
        {
            type: "confirm",
            name: "insideMonorepo",
            message: "Is package inside a monorepo?",
            default: assumptions.insideMonorepo,
            when(answers: Partial<PackageContextAnswers>) {
                if (answers.type === PackageType.Monorepo) {
                    answers.insideMonorepo = false;
                    return false;
                }

                return true;
            },
        },
        {
            type: "list",
            name: "access",
            message: "Access level:",
            choices: Object.values(PackageAccessLevel).map(accessLevelChoice),
            when(answers: Partial<PackageContextAnswers>) {
                if (answers.type === PackageType.Monorepo) {
                    answers.access = PackageAccessLevel.Private;
                    return false;
                }

                return true;
            },
        },
        {
            type: "list",
            name: "license",
            message: "License:",
            choices: Object.values(License),
            loop: false,
            default(answers: Partial<PackageContextAnswers>) {
                return answers.access === PackageAccessLevel.Public
                    ? License.Mit
                    : License.Unlicensed;
            },
        },
        {
            type: "input",
            name: "author",
            message: "Author:",
            default(answers: Partial<PackageContextAnswers>) {
                return (answers.scope?.slice(1) ?? "") || assumptions.author;
            },
            filter(val: string) {
                return val.trim();
            },
            validate: Boolean,
            when(answers: Partial<PackageContextAnswers>) {
                return answers.access !== PackageAccessLevel.Private;
            },
        },
        {
            type: "input",
            name: "description",
            message: "Description:",
            filter(val: string) {
                return val.trim();
            },
            validate: Boolean,
            when(answers: Partial<PackageContextAnswers>) {
                return answers.access !== PackageAccessLevel.Private;
            },
        },
        {
            type: "input",
            name: "repository",
            message: "Repository:",
            default(answers: Partial<PackageContextAnswers>) {
                const author = answers.author ?? "";
                const name = answers.name ?? "";
                return (
                    assumptions.repository ??
                    `https://github.com/${author}/${name}.git`
                );
            },
            filter(val: string) {
                return val.trim();
            },
            transformer(val: string) {
                return formatGitUrlHttps(val);
            },
            validate: Boolean,
            when(answers: Partial<PackageContextAnswers>) {
                return answers.access !== PackageAccessLevel.Private;
            },
        },
    ]);

    // blank line before confirm
    console.log();

    await promptToContinue("Create package with above details?");

    return new PackageContext(answers);
}
