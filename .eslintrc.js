module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    optionalChaining: true,
    ecmaFeatures: {
      jsx: true,
      spread: true
    }
  },
  env: {
    browser: true,
    jest: true,
    es6: true
  },
  extends: [
    'eslint:recommended'
  ],
  plugins: [
    'babel',
    'import',
    'es',
    'import-newlines',
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: ['node_modules', 'build'],
  rules: {
    'linebreak-style': ['error', 'unix'],
    'arrow-spacing': ['error'],
    'keyword-spacing': ['warn'],
    'key-spacing': ['warn'],
    'no-multi-spaces': 'error',
    'max-len': ['error', 120, {
      ignoreComments: true,
      ignoreStrings: true,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true
    }],
    'object-curly-spacing': ['error', 'always'],
    'arrow-parens': 'off',
    'space-in-parens': 'warn',
    'no-trailing-spaces': 'warn',
    'no-case-declarations': ['warn'],
    'no-mixed-operators': 'off',
    'operator-linebreak': ['error', 'before'],
    eqeqeq: 'error',
    'no-debugger': 'warn',
    'no-empty': 'warn',
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-double'],
    'quote-props': ['error', 'as-needed'],
    semi: ['error', 'always'],
    'no-extra-semi': ['error'],
    'no-undef': ['error'],
    'no-unused-vars': ['warn'],
    'no-const-assign': ['error'],
    'no-cond-assign': ['error', 'except-parens'],
    'no-console': ['warn', {
      allow: [
        // 'log',
        // 'dir',
        // 'info',
        'warn',
        'error',
        // 'debug',
        // 'group',
        // 'groupEnd'
      ]
    }],
    'comma-spacing': ['error'],
    'comma-dangle': ['error', 'only-multiline'],
    'callback-return': 'error',
    'import/newline-after-import': ['error', {
      count: 2,
    }],
    'import/order': 'off',
    'import/no-named-as-default': 'off',
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off',
    'import/no-anonymous-default-export': 'off',
    'no-useless-backreference': 'warn',
    'es/no-regexp-lookbehind-assertions': 'warn',
    'template-curly-spacing': 'error',
    'computed-property-spacing': 'error',
    'function-call-argument-newline': ['error', 'consistent'],
    'function-paren-newline': ['error', 'multiline-arguments'],
    'newline-per-chained-call': 'error',
    'import-newlines/enforce': ['error', { items: 1 }],
  },
  globals: {
    __: true,
    __dirname: true,
    App: true,
    fetch: true,
    module: true,
    require: true,
    process: true,
    promise: true,
    Promise: true
  }
};
