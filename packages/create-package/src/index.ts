#!/usr/bin/env node

import promptPackageContext from "~/src/cli/promptPackageContext";
import UserCancelledError from "~/src/errors/UserCancelledError";
import { chdir, exit } from "process";
import collectAssumptions from "./assumptions/collectAssumptions";
import findMatchingComponents from "./components/findMatchingComponents";

try {
    // TODO: maybe assumptions should be collected after directory is set...
    const assumptions = await collectAssumptions();
    const context = await promptPackageContext(assumptions);
    const components = findMatchingComponents(context);

    // go to package directory so most commands don't need to set cwd themselves
    chdir(context.directory);

    for (const component of components) {
        await component.apply(context);
    }
} catch (err) {
    if (err instanceof UserCancelledError) {
        exit(1);
    }

    throw err;
}
