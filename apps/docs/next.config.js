const withTM = require("next-transpile-modules")(["@sovryn/onboard-react"]);

module.exports = withTM({
  reactStrictMode: true,
});
