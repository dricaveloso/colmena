const withPWA = require("next-pwa");
const withImages = require("next-images");

const customExports = {
  publicRuntimeConfig: {
    api: {
      baseUrl: process.env.API_BASE_URL,
    },
  },
};

module.exports = withImages(
  withPWA({
    future: { webpack5: true },
    pwa: {
      dest: "public",
      disable: process.env.NODE_ENV === "development",
      cacheOnFrontEndNav: true,
      swSrc: "/sw.js",
      fallbacks: {
        document: "/fallback",
      },
    },
    ...customExports,
  })
);
