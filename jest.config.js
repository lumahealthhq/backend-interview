/** @type {import('jest').Config} */
module.exports = {
  roots: ["<rootDir>/src"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["<rootDir>/src/**"],
  testEnvironment: "node",
};
