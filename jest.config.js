/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src/',
  testMatch: ['**/__tests__/**/*.spec.[jt]s?(x)', '**/*.spec.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '\\.e2e\\.spec\\.[jt]s$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
