import styles from "./styles/page-sponsors.module.scss";
import Container from "../components/container";
import Image from "next/image";

import { CMS_NAME, CMS_URL } from "../lib/constants";
//

export default function PageAd({ adData }) {
  adData = adData?.adsFields;
  if (!adData) return null;
  return (
    <Container>
      <section className={(styles.sponsors || "") + ""}>
        <div
          className={
            (styles.sponsors__inner || "") + " flex flex-wrap my-6 lg:my-12"
          }
        >
          {adData && adData.link ? (
            <a
              href={adData.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.banner_ad || ""} glisten larger-link`}
            >
              {/* <small className={styles.notice}>Sponsored by:</small> */}
              {adData.largeBanner ? (
                <Image
                  src={adData.largeBanner.mediaItemUrl}
                  alt=""
                  width={1920}
                  height={1080}
                />
              ) : adData.smallBanner ? (
                <Image
                  src={adData.smallBanner.mediaItemUrl}
                  alt=""
                  width={1920}
                  height={1080}
                />
              ) : null}
            </a>
          ) : (
            <div className={`${styles.banner_ad || ""}`}>
              {adData.largeBanner ? (
                <Image
                  src={adData.largeBanner.mediaItemUrl}
                  alt=""
                  width={1920}
                  height={1080}
                />
              ) : null}
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
