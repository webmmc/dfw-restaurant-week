import type { AppProps } from "next/app";
import { useRouter } from "next/router";
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

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Remove previously-added route classes
    document.body.className = document.body.className
      .split(" ")
      .filter((cls) => !cls.startsWith("page-"))
      .join(" ");

    // Add the current route as a body class
    const pageClass =
      router.pathname === "/"
        ? "page-home"
        : `page-${router.pathname.replace(/\//g, "-").replace(/^-/, "")}`;

    document.body.classList.add(pageClass);
  }, [router.pathname]);

  return <Component {...pageProps} />;
}