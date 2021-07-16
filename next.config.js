const withPWA = require("next-pwa");
const withImages = require("next-images");
const { i18n } = require("./next-i18next.config");
const path = require('path');

module.exports = withImages(
  withPWA({   
    i18n,
    future: { webpack5: true },
    sassOptions: {
      includePaths: [path.join(__dirname, 'src/styles')],
    },
    pwa: {
      dest: "public",
      disable: process.env.NODE_ENV === "development",
      cacheOnFrontEndNav: true,
      swSrc: "/sw.js",
      fallbacks: {
        document: "/fallback",
      },
    },
  }),
);
