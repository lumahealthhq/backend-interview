/* eslint-disable */
const jestConfig = require("./jest.config.js");

module.exports = {
  ...jestConfig,
  testMatch: ["**/*.test.js"],
};
