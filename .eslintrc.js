module.exports = {
  parser: 'babel-eslint',
  plugins: ['prettier', 'react'],
  env: {
    node: true,
    es6: true,
    browser: true
  },
  overrides: [
    {
      files: ['webapp/**/*.js'],
      env: {
        node: false,
        browser: true,
        commonjs: true
      },
      globals: {
        NODE_ENV: true,
        window: true,
        console: true
      }
    },
    {
      files: ['test/**/*.js'],
      env: {
        mocha: true,
        node: true,
      }
    }
  ],
  settings: {
    react: {
      version: "16.2.0",
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-console': ['warn']
  },
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended'  ]
};

