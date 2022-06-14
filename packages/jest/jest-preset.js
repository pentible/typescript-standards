/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires */
// TODO: try to convert to .ts
const ts_preset = require("ts-jest/jest-preset");
const { tsconfigToModuleNameMapper } = require(".");

module.exports = {
    ...ts_preset,

    // All imported modules in your tests should be mocked automatically
    automock: true,

    // Automatically reset mock state before every test
    resetMocks: true,

    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: "v8",

    // Make calling deprecated APIs throw helpful error messages
    errorOnDeprecated: true,

    // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
    moduleNameMapper: tsconfigToModuleNameMapper("./tsconfig.json"),
};

/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires */
