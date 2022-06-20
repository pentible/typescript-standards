import { isErrorWithCode, isErrorWithExitCode } from "~/src/utility/errors";

jest.unmock("~/src/utility/errors");

const commonInvalidCases: [boolean, unknown][] = [
    [false, undefined],
    [false, null],
    [false, true],
    [false, false],
    [false, 0],
    [false, 1],
    [false, 99],
    [false, ""],
    [false, []],
    [false, [""]],
    [false, {}],
    [false, { test: "" }],
];

function constructErrorWith(fields: Record<string, unknown>): Error {
    const error = new Error();

    return Object.assign(error, fields);
}

describe("errors", () => {
    describe("isErrorWithCode", () => {
        const cases: [boolean, unknown][] = [
            ...commonInvalidCases,
            [false, constructErrorWith({ code: 0 })],
            [true, constructErrorWith({ code: "" })],
        ];

        it.each(cases)("%j: %j", (output, input) => {
            const result = isErrorWithCode(input);

            expect(result).toBe(output);
        });
    });

    describe("isErrorWithExitCode", () => {
        const cases: [boolean, unknown][] = [
            ...commonInvalidCases,
            [false, constructErrorWith({ exitCode: "" })],
            [true, constructErrorWith({ exitCode: 0 })],
        ];

        it.each(cases)("%j: %j", (output, input) => {
            const result = isErrorWithExitCode(input);

            expect(result).toBe(output);
        });
    });
});
