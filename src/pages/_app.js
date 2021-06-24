import React, { useEffect } from "react";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { appWithTranslation } from "next-i18next";
import GlobalLayout from "component/layout/GlobalLayout";
import { NotificationContextProvider } from "store/notification-context";
import { UserContextProvider } from "store/user-context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import PropTypes from "prop-types";
import theme from "styles/theme";
import "styles/globals.css";

const cache = createCache({ key: "css" });
cache.compat = true;

function MyApp(props) {
  const { Component, pageProps } = props;

  return (
    <CacheProvider value={cache}>
      <Head>
        <title>MAIA - Create, Collaborate and Share </title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <NotificationContextProvider>
          <UserContextProvider>
            <GlobalLayout>
              <CssBaseline />
              <Component {...pageProps} />
            </GlobalLayout>
          </UserContextProvider>
        </NotificationContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default appWithTranslation(MyApp);
