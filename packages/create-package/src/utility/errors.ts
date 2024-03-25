interface ErrorWithCode extends Error {
    code: string;
}

export function isErrorWithCode(val: unknown): val is ErrorWithCode {
    return (
        val instanceof Error && "code" in val && typeof val.code === "string"
    );
}

interface ErrorWithExitCode extends Error {
    exitCode: number;
}

export function isErrorWithExitCode(val: unknown): val is ErrorWithExitCode {
    return (
        val instanceof Error &&
        "exitCode" in val &&
        typeof val.exitCode === "number"
    );
}
