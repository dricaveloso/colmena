const withPWA = require("next-pwa");
const withOffline = require("next-offline");

module.exports = withOffline(
  withPWA({
    pwa: {
      dest: "public",
    },
  })
);
