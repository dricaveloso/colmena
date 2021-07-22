import React from "react";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import GlobalLayout from "@/components/layout/GlobalLayout";
import { NotificationContextProvider } from "@/store/context/notification-context";
import { UserContextProvider } from "@/store/context/user-context";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import theme from "@/styles/theme";
import CONSTANTS from "@/constants/index";
import NextNprogress from "nextjs-progressbar";
import "@/styles/globals.css";
import { useStore } from "@/store/index";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState);
  const persistor = persistStore(store, {}, () => {
    persistor.persist();
  });

  React.useEffect(() => {
    const jssStyles: Element | null = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<div>loading</div>} persistor={persistor}>
        <Head>
          <title>{CONSTANTS.APP_NAME} - Create, Collaborate and Share </title>
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
                <NextNprogress
                  color="#d8e0e4"
                  startPosition={0.6}
                  stopDelayMs={200}
                  height={3}
                  showOnShallow
                />
                <Component {...pageProps} />
              </GlobalLayout>
            </UserContextProvider>
          </NotificationContextProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default appWithTranslation(MyApp);
