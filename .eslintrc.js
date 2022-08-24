module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@sovryn/onboard-eslint-config`
  extends: ["@sovryn/onboard-eslint-config"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
