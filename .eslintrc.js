module.exports = {
  env: {
    browser: true,
    node: true
  },
  extends: ['eslint:recommended'],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'space-before-function-paren': ['error', 'never'],
  },
  globals: {
    define: false,
    __non_webpack_require__: false,
    Uint8Array: false
  }
}
