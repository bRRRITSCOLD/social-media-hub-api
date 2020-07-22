module.exports = {
  env: {
    es2020: true,
  },
  extends: [
    // 'plugin:react/recommended',
    // 'airbnb',
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    'import/prefer-default-export': [0],
    'arrow-body-style': [0],
    '@typescript-eslint/no-unsafe-assignment': [0],
    '@typescript-eslint/unbound-method': [0],
    "no-param-reassign": [0],
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};
