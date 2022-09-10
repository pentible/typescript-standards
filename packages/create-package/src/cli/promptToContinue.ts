import { prompt } from "src/cli/prompt";
import { UserCancelledError } from "src/errors/UserCancelledError";

interface Answers {
    approved: boolean;
}

export async function promptToContinue(message: string) {
    const { approved } = await prompt<Answers>([
        {
            type: "confirm",
            name: "approved",
            message,
        },
    ]);

    if (!approved) {
        throw new UserCancelledError();
    }
}
