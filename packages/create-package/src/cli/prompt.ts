import inquirer from "inquirer";
import type { Answers, DistinctQuestion } from "inquirer";

export async function prompt<T extends Answers = Answers>(
    questions: DistinctQuestion<T>[],
    initialAnswers?: Partial<T>,
) {
    return await inquirer.prompt<T>(questions, initialAnswers);
}
