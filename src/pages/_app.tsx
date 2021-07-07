import React from "react";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import GlobalLayout from "component/layout/GlobalLayout";
import { NotificationContextProvider } from "store/notification-context";
import { UserContextProvider } from "store/user-context";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import theme from "styles/theme";
import "styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    const jssStyles: Element | null = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Colmena - Create, Collaborate and Share </title>
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
    </>
  );
}

export default appWithTranslation(MyApp);
