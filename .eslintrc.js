module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
  },
  plugins: [
    'react',
  ],
  rules: {
    'max-len': 0,
    'no-param-reassign': 0,
    'import/extensions': 0,
    'no-console': 0,
    // eslint-disable-next-line quote-props
    'camelcase': 0,
    'react/prop-types': 0,
    'react/button-has-type': 0,
    'no-cond-assign': 0,
  },
};
