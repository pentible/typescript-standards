import fs from "fs";
import { pathsToModuleNameMapper } from "ts-jest";

type TSConfig = {
    compilerOptions?: {
        paths?: Record<string, string[]>;
    };
};

export function tsconfigToModuleNameMapper(path: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const tsconfig: TSConfig = JSON.parse(fs.readFileSync(path, "utf8"));

    return pathsToModuleNameMapper(tsconfig?.compilerOptions?.paths ?? {}, {
        prefix: "<rootDir>/",
    });
}
