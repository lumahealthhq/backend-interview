/** @type {import('jest').Config} */
module.exports = {
  roots: ["<rootDir>/tests"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["<rootDir>/src/**"],
  testEnvironment: "node",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};
