const { resolve } = require("path");
const root = resolve(__dirname);

module.exports = {
    rootDir: root,
    displayName: 'test',
    testMatch: ['<rootDir>/src/**/*.spec.ts'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
};