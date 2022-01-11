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
    serverRuntimeConfig: {
      hotjarProd: process.env.HOTJAR_PROD,
      appEnv: process.env.APP_ENV,
      adminInfo: {
        username: process.env.USERNAME_ADMIN_NC,
        password: process.env.PASSWORD_ADMIN_NC
      },
      api: {
        baseUrl: process.env.API_BASE_URL
      },
    },
    publicRuntimeConfig: {
      api: {
        baseUrl: process.env.API_BASE_URL
      },
      NCTalkVersion: process.env.NEXTCLOUD_TALK_VERSION,
      user: {
        defaultNewUserPassword: process.env.DEFAULT_USER_PASSWORD
      }
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
    async redirects() {
      return [
        {
          source: '/reset',
          destination: '/',
          permanent: true,
        },
        {
          source: '/',
          destination: '/login',
          permanent: true,
        },
      ]
    },
  }),
);
