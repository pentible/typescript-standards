// TODO: convert config to ts and generate this file instead
declare module "@pentible/eslint-config" {
    export const pentibleEslintConfig: import("eslint").Linter.Config;
    // TODO: fix (probs just by generating)
    export const naming: unknown[];
    export function noRestrictedGlobalWithMessage(message: string);
    export function relativeIgnoreFile(
        file: string,
        base: string,
        name?: string,
    );
}
