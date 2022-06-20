import formatGitUrlHttps from "~/src/utility/formatGitUrlHttps";

jest.unmock("~/src/utility/formatGitUrlHttps");

describe("git", () => {
    describe("formatGitUrlHttps", () => {
        const cases = [
            ["", ""],
            [
                "https://github.com/pentible/typescript-standards.git",
                "https://github.com/pentible/typescript-standards.git",
            ],
            [
                "git@github.com:pentible/typescript-standards.git",
                "https://github.com/pentible/typescript-standards.git",
            ],
        ];

        it.each(cases)("%j -> %j", (input, output) => {
            const result = formatGitUrlHttps(input);

            expect(result).toBe(output);
        });
    });
});
