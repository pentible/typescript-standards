// TODO: try to convert to .ts (should allow us to fix eslint)
const ts_preset = require("ts-jest/jest-preset");

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
};
