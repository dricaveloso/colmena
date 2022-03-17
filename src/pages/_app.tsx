/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import GlobalLayout from "@/components/ui/GlobalLayout";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import theme from "@/styles/theme";
import CONSTANTS from "@/constants/index";
import { useStore } from "@/store/index";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Provider as NextAuthProvider } from "next-auth/client";
import { verifyIndexedDBBrowserEnable } from "@/utils/utils";
import Transfer from "@/components/statefull/Transfer";
import "waveform-playlist/styles/playlist.css";
import "@/styles/globals.css";
import LoadingPage from "@/components/ui/LoadingPage";

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState);
  const persistor = persistStore(store, {}, () => {
    persistor.persist();
  });

  React.useEffect(() => {
    verifyIndexedDBBrowserEnable();
    const jssStyles: Element | null = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <NextAuthProvider session={pageProps.session}>
      <Provider store={store}>
        <PersistGate
          loading={
            <div>
              <LoadingPage open />
            </div>
          }
          persistor={persistor}
        >
          <Head>
            <title>
              {CONSTANTS.APP_NAME} - {CONSTANTS.APP_DESCRIPTION}{" "}
            </title>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
            />
          </Head>
          <ThemeProvider theme={theme}>
            <GlobalLayout>
              <CssBaseline />
              <Component {...pageProps} />
              <Transfer />
            </GlobalLayout>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </NextAuthProvider>
  );
}

export default appWithTranslation(MyApp);
