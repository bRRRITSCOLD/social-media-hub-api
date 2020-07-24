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
    "@typescript-eslint/no-unsafe-member-access": [0],
    '@typescript-eslint/no-floating-promises': [0],
    '@typescript-eslint/no-var-requires': [0],
    'global-require': [0],
    '@typescript-eslint/no-throw-literal': [0],
    '@typescript-eslint/no-unsafe-call': [0],
    '@typescript-eslint/lines-between-class-members': [0],
    'max-len': [0],
    'max-classes-per-file': [0],
    'no-useless-catch': [0],
    'no-plusplus': [0],
    'no-await-in-loop': [0],
    'class-methods-use-this': [0],
    '@typescript-eslint/ban-ts-comment': [0],
    'no-unsafe-return': [0],
    '@typescript-eslint/no-unsafe-return': [0],
    '@typescript-eslint/restrict-template-expressions': [0],
    'consistent-return': [0],
    '@typescript-eslint/await-thenable': [0],
    'no-loop-func': [0],
    '@typescript-eslint/require-await': [0]
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};
