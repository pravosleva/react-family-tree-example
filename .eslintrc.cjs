module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: [
    'dist/*',
    'dist.*/*',
    '.eslintrc.cjs',
    'public/*',
    'config/*',
    'build/*',
    'scripts/*',
    '__tests__/*',
    '**/__tests__/*',
  ],
  rules: {
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-extra-boolean-cast': 'off',
  },
}
