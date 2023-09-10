export abstract class CheckError extends Error {
    constructor(
        message: string,
        readonly description: string,
    ) {
        super(message);
    }
}

export class UnknownCheckError extends CheckError {
    override name = "UnknownCheckError" as const;

    constructor(readonly cause: Error) {
        super("unknown error", `${cause.message}: ${cause.stack ?? ""}`);
        this.stack = cause.stack;
    }
}
