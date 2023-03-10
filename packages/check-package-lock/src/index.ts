#!/usr/bin/env node

import { Console } from "console";
import fs, { constants } from "fs/promises";
import { stderr, stdout } from "process";
import chalk, { supportsColor } from "chalk";
import type { ExecaError, Options } from "execa";
import { execa } from "execa";
import { checkDependenciesConflict } from "src/check-conflicting-dependencies";
import { hideBin } from "yargs/helpers";
import { CheckError, UnknownCheckError } from "src/checks";
import yargs from "yargs/yargs";
import { z } from "zod";
import type { Result } from "src/result";
import { ErrFromUnknown, Err, Ok } from "src/result";
import { isNonNullable } from "src/utils";

async function execaResult(
    file: string,
    args?: readonly string[],
    options?: Options,
) {
    const returnValue = await execa(file, args, options).catch((e) => e);
    if (returnValue instanceof Error) {
        return Err(returnValue);
    }

    return Ok(returnValue);
}

class LockOutOfSyncCheckError extends CheckError {
    override name = "LockOutOfSyncCheckError" as const;

    constructor(readonly cause: ExecaError) {
        super("package lock not in sync", cause.all ?? ""); // TODO: could just do: cause.stderr (maybe have a cli flag for extra details)
    }
}

// verify that the package-lock.json is up to date with the package.json
async function checkLockInSync() {
    const npmArgs: string[] = [];
    if (supportsColor) {
        npmArgs.push("--color=always");
    }

    const result = await execaResult(
        "npm",
        ["ls", "--package-lock-only", ...npmArgs],
        { all: true },
    );

    if (!result.ok) {
        return Err(new LockOutOfSyncCheckError(result.error));
    }

    return Ok(true);
}

async function loadJsonFile<T extends z.ZodType>(
    path: string,
    schema: T,
): Promise<Result<z.infer<T>, Error>> {
    try {
        const file = await fs.readFile(path);
        const contents = file.toString();
        const json: unknown = JSON.parse(contents);

        const res = await schema.safeParseAsync(json);
        if (!res.success) {
            return Err(res.error);
        }

        return Ok(res.data);
    } catch (error) {
        return ErrFromUnknown(error);
    }
}

async function checkIfPackageIsMonorepo() {
    const packageJsonSchema = z.object({
        workspaces: z.array(z.string()).optional(),
    });

    const res = await loadJsonFile("package.json", packageJsonSchema);
    if (!res.ok) {
        return Err(new UnknownCheckError(res.error));
    }

    const packageJson = res.value;
    return Ok(Boolean(packageJson.workspaces));
}

// package lock schema
const packageLockSchema = z.object({
    packages: z.record(z.string(), z.object({})),
});

async function asyncFilter<T>(
    data: T[],
    callback: (value: T, index: number, array: T[]) => Promise<boolean>,
) {
    // run callback for all elements
    const promises = data.map(async (e, i, a) => {
        const result = await callback(e, i, a);
        return [result, e] as const;
    });

    // resolve all promises
    const results = await Promise.all(promises);

    // filter & map back to original format
    return results.filter(([r]) => r).map(([_, e]) => e);
}

class MissingWorkspacesCheckError extends CheckError {
    override name = "MissingWorkspacesCheckError" as const;

    constructor(readonly workspaces: string[]) {
        super("missing workspaces detected", `- ${workspaces.join("\n- ")}`);
    }
}

async function checkMissingWorkspaces() {
    const res = await loadJsonFile("package-lock.json", packageLockSchema);
    if (!res.ok) {
        return Err(new UnknownCheckError(res.error));
    }
    const packageLock = res.value;

    const packages = Object.keys(packageLock.packages)
        // filter out node_modules
        .filter((p) => !p.startsWith("node_modules/"))
        // filter out monorepo root package
        .filter((p) => p !== "");

    // filter out packages that exist
    const missing = await asyncFilter(packages, async (p) => {
        try {
            await fs.access(p, constants.R_OK);
            return false; // exists and is readable
        } catch (error) {
            return true; // missing
        }
    });

    if (missing.length > 0) {
        return Err(new MissingWorkspacesCheckError(missing));
    }

    return Ok(true);
}

type Check = () => Promise<Result<boolean, CheckError>>;

async function main() {
    const console = new Console({ groupIndentation: 4, stdout, stderr });

    // TODO: consider a lockFilePath param (checkLockInSync might need to be
    // skipped then if there's no adjacent package.json...)

    // parse args
    await yargs(hideBin(process.argv))
        .scriptName("check-package-lock")
        .usage("Usage: $0")
        .alias("h", "help")
        .alias("v", "version")
        .option("color", { choices: ["always", "never"] }) // NOTE: auto detected by chalk... woof
        .demandCommand(0, 0)
        .recommendCommands()
        .strict().argv;

    // check if package is a monorepo
    const isMonorepoResult = await checkIfPackageIsMonorepo();
    if (!isMonorepoResult.ok) {
        console.error("could not determine if the package was a monorepo");
        console.error(isMonorepoResult.error);
        process.exit(1);
    }
    const isMonorepo = isMonorepoResult.value;

    // all applicable checks
    const checks: Check[] = [checkLockInSync];
    if (isMonorepo) {
        checks.push(checkMissingWorkspaces, checkDependenciesConflict);
    }

    // run checks
    const results = await Promise.all(checks.map(async (c) => c()));

    // filter out successful checks
    const failedChecks = results
        .map((r) => (r.ok ? undefined : r.error))
        .filter(isNonNullable);

    // print failed checks
    for (const failedCheck of failedChecks) {
        console.group(chalk.red(`! ${failedCheck.message}`));
        // TODO: should maybe move descriptions out of the exceptions
        // - (ie. here check each exception type and format details appropriately)
        console.log(failedCheck.description);
        console.groupEnd();
    }

    // exit unsuccessfully if any checks failed
    if (failedChecks.length > 0) {
        process.exit(1);
    }
}

void main();
