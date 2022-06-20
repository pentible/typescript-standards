// TODO: use ~ import once ts
const pentible_preset = require("../jest-preset");

module.exports = {
    ...pentible_preset,

    // run tests from one or more projects
    projects: ["<rootDir>/packages/*"],
};
