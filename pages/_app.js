import "../styles/globals.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CssBaseline />
      <Head>
        <title>MAIA</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
