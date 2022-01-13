import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/core/styles";
import theme from "@/styles/theme";
import CONSTANTS from "@/constants/index";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta name="application-name" content={CONSTANTS.APP_NAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content={CONSTANTS.APP_NAME} />
          <meta
            name="description"
            content={`${CONSTANTS.APP_NAME}  - Create, Collaborate and Share`}
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/static/icons/browserconfig.xml" />
          <meta name="msapplication-TileColor" content={theme.palette.primary.main} />
          <meta name="msapplication-tap-highlight" content="no" />

          <link rel="apple-touch-icon" sizes="60x60" href="/icons/pwa/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/icons/pwa/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/icons/pwa/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/icons/pwa/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/icons/pwa/apple-icon-167x167.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/pwa/apple-icon-180x180.png" />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/icons/pwa/android-icon-192x192.png"
          />
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/pwa/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/icons/pwa/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/pwa/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content={theme.palette.primary.main} />
          <meta name="msapplication-TileImage" content="ms-icon-150x150.png" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito+Sans&display=swap"
            rel="stylesheet"
          />
          {serverRuntimeConfig.appEnv === "staging" && <script src="/js/dev_hotjar.js" />}
          {serverRuntimeConfig.appEnv === "production" && <script src="/js/prod_hotjar.js" />}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
