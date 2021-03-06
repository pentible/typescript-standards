type ErrorWithCode = Error & {
    code: string;
};

export function isErrorWithCode(val: unknown): val is ErrorWithCode {
    return (
        val instanceof Error && typeof (val as ErrorWithCode).code === "string"
    );
}

type ErrorWithExitCode = Error & {
    exitCode: number;
};

export function isErrorWithExitCode(val: unknown): val is ErrorWithExitCode {
    return (
        val instanceof Error &&
        typeof (val as ErrorWithExitCode).exitCode === "number"
    );
}
