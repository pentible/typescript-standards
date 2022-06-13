export default class UserCancelledError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "UserCancelledError";
    }
}
