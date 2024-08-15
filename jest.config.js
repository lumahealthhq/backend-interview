/** @type {import('jest').Config} */
module.exports = {
  roots: ["<rootDir>/tests"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["<rootDir>/src/**"],
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "@/tests/(.*)": "<rootDir>/tests/$1",
    "@/(.*)": "<rootDir>/src/$1",
  },
};
