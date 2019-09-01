module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "comma-dangle": [2, "never"],
    "max-len": [1, {
      "code": 130,
      "ignoreStrings": true,
      "ignoreComments": true,
      "ignoreRegExpLiterals": true
  }],
  },
};
