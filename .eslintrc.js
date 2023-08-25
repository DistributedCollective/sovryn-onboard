module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ['@sovryn/eslint-config-custom'],
  ignorePatterns: ['build/', 'dist/'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-throw-literal': 'off',
  },
};
