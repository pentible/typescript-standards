/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires */
// TODO: use ~ import once ts
const pentible_preset = require("@pentible/jest/jest-preset");

module.exports = {
    ...pentible_preset,

    // Run tests from one or more projects
    projects: ["<rootDir>/packages/*"],
};

/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires */
