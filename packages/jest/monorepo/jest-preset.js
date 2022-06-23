// TODO: use ~ import once ts
const pentiblePreset = require("../jest-preset");

module.exports = {
    ...pentiblePreset,

    // run tests from one or more projects
    projects: ["<rootDir>/packages/*"],
};
