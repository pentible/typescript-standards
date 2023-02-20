#!/usr/bin/env node

import { chdir, exit } from "process";
import { findMatchingComponents } from "./components/find-matching-components";
import { Formatter } from "./formatting/formatter";
import { collectAssumptions } from "src/assumptions/collect-assumptions";
import { promptPackageContext } from "src/cli/prompt-package-context";
import { UserCancelledError } from "src/errors/user-cancelled-error";

async function main() {
    try {
        // TODO: maybe assumptions should be collected after directory is set...
        const assumptions = await collectAssumptions();
        const context = await promptPackageContext(assumptions);
        const components = findMatchingComponents(context);
        const formatter = new Formatter();

        // go to package directory so most commands don't need to set cwd themselves
        chdir(context.directory);

        for (const component of components) {
            await component.apply(context, formatter);
        }
    } catch (err) {
        if (err instanceof UserCancelledError) {
            exit(1);
        }

        throw err;
    }
}

void main();
