export type Result<T, E extends Error> =
    | { readonly ok: false; readonly error: E }
    | { readonly ok: true; readonly value: T };

export function Ok<T>(value: T) {
    return { ok: true, value } as const;
}

export function Err<E extends Error>(error: E) {
    return { ok: false, error } as const;
}

export function ErrFromUnknown(error: unknown) {
    if (error instanceof Error) {
        return Err(error);
    }

    return Err(new UnknownResultError(error));
}

class UnknownResultError extends Error {
    override name = "UnknownResultError" as const;
    override readonly cause: unknown;

    constructor(cause: unknown) {
        super(`caught unrecognized error: ${String(cause)}`);
        this.cause = cause;
    }
}
