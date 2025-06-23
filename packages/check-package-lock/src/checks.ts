export abstract class CheckError extends Error {
    readonly description: string;

    constructor(message: string, description: string) {
        super(message);
        this.description = description;
    }
}

export class UnknownCheckError extends CheckError {
    override name = "UnknownCheckError" as const;
    override readonly cause: Error;

    constructor(cause: Error) {
        super("unknown error", `${cause.message}: ${cause.stack ?? ""}`);
        this.stack = cause.stack;
        this.cause = cause;
    }
}
