import fs from "fs/promises";
import { userInfo } from "os";
import { execaCommand } from "execa";
import { tryLoadPackageJson } from "#src/assumptions/try-load-package-json";
import type { PackageContextAssumptions } from "#src/cli/prompt-package-context";
import { isErrorWithCode, isErrorWithExitCode } from "#src/utility/errors";
import { formatGitUrlHttps } from "#src/utility/format-git-url-https";

function assumeDirectory() {
    // TODO: ~/ support
    return process.cwd();
}

async function assumeScope() {
    // TODO: make more flexible (ie. if root doesn't have a scope, maybe adjacent
    // children do, or find relative to directory passed in instead of cwd)
    const monorepoPackageJson = await tryLoadPackageJson("../../package.json");
    return monorepoPackageJson?.name.match(/^(@[^/]+)\/.*$/u)?.[1];
}

async function assumeInsideMonorepo() {
    try {
        // TODO: make more flexible
        const stats = await fs.stat("../../package.json");
        return stats.isFile();
    } catch (err) {
        // ignore file not exist error
        if (!isErrorWithCode(err) || err.code !== "ENOENT") {
            throw err;
        }
    }

    return false;
}

async function assumeRepository() {
    try {
        const { stdout } = await execaCommand("git remote get-url origin");

        return formatGitUrlHttps(stdout);
    } catch (err) {
        if (isErrorWithExitCode(err)) {
            return undefined;
        }

        throw err;
    }
}

function assumeAuthor() {
    return userInfo().username;
}

export async function collectAssumptions(): Promise<PackageContextAssumptions> {
    // TODO: maybe load monorepo package json here and pass into relevant sub-functions
    const directory = assumeDirectory();
    const scope = await assumeScope();
    const insideMonorepo = await assumeInsideMonorepo();
    const repository = await assumeRepository();
    const author = assumeAuthor();

    return {
        directory,
        scope,
        insideMonorepo,
        repository,
        author,
    };
}
