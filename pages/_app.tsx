import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ItineraryProvider } from "../context/ItineraryContext";
import TagManager from "react-gtm-module";

import { GlobalProvider } from "../context/GlobalContext";
import NextNProgress from "nextjs-progressbar";
import "../styles/index.scss";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // GTM tracking
  useEffect(() => {
    TagManager.initialize({
      gtmId: "GTM-5GNR7L8",
    });
  }, []);

  // Add page class to <body>
  useEffect(() => {
    // Remove previous page-* classes
    document.body.className = document.body.className
      .split(" ")
      .filter((cls) => !cls.startsWith("page-"))
      .join(" ");

    // Add current page class
    const pageClass =
    router.asPath === "/"
      ? "page-home"
      : `page-${router.asPath
          .split("?")[0] // Remove query string
          .replace(/\/$/, "") // Remove trailing slash
          .replace(/\//g, "-")
          .replace(/^-/, "")}`;

    document.body.classList.add(pageClass);
  }, [router.pathname]);

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