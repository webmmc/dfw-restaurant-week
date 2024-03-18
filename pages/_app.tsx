import type { AppProps } from "next/app";

import { useEffect } from "react";
import { ItineraryProvider } from "../context/ItineraryContext";
import TagManager from "react-gtm-module";

import { GlobalProvider } from "../context/GlobalContext";
import NextNProgress from "nextjs-progressbar";
import "../styles/index.scss";

function MyApp({ Component, pageProps }: AppProps) {
  //GTM tracking
  useEffect(() => {
    TagManager.initialize({
      gtmId: "GTM-5GNR7L8",
    });
  }, []);
  return (
    <>
      <NextNProgress color="#da3743" />
      <ItineraryProvider>
        <GlobalProvider>
          <Component {...pageProps} />
        </GlobalProvider>
      </ItineraryProvider>
    </>
  );
}

export default MyApp;
