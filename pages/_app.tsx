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
    document.body.className = document.body.className
      .split(" ")
      .filter((cls) => !cls.startsWith("page-"))
      .join(" ");
  
    const slug = pageProps.pageSlug;
  
    const pageClass = slug
      ? `page-${slug}`
      : router.pathname === "/"
      ? "page-home"
      : `page-${router.pathname.replace(/\//g, "-").replace(/^-/, "")}`;
  
    document.body.classList.add(pageClass);
  }, [pageProps.pageSlug, router.asPath]);

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