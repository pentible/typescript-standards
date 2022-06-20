// TODO: try to convert to .ts
const ts_preset = require("ts-jest/jest-preset");

module.exports = {
    ...ts_preset,

    // all imported modules in your tests should be mocked automatically
    automock: true,

    // automatically reset mock state before every test
    resetMocks: true,

    // indicates which provider should be used to instrument code for coverage
    coverageProvider: "v8",

    // make calling deprecated APIs throw helpful error messages
    errorOnDeprecated: true,
};
