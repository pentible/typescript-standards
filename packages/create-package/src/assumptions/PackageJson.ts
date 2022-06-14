import fs from "fs/promises";
import { isErrorWithCode } from "~/src/utility/errors";

export type PackageJson = {
    name: string;
};

export function isPackageJson(val: unknown): val is PackageJson {
    if (!val || typeof val !== "object") {
        return false;
    }

    const unsafe = val as PackageJson;
    return typeof unsafe.name === "string";
}

export async function tryLoadPackageJson(path: string) {
    try {
        const contents = await fs.readFile(path, "utf8");
        const json: unknown = JSON.parse(contents);
        if (isPackageJson(json)) {
            return json;
        }
    } catch (err) {
        // ignore file not exist error
        if (!isErrorWithCode(err) || err.code !== "ENOENT") {
            throw err;
        }
    }

    return undefined;
}