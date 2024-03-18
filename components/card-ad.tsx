import Image from "next/image";

import styles from "./styles/restaurant-filter.module.scss";

export default function CardAd({ adData }) {
  adData = adData?.adsFields;
  if (!adData) return null;
  return (
    <div>
      <div className={`${styles.dining_card} ${styles.dining_card_ad} relative larger-link glisten`}>
        {adData && adData.link ? (
          <a
            href={adData.link}
            target="_blank"
            rel="noopener noreferrer"
            className="card-ad__link"
          >
            {adData.largeBanner ? (
              <Image
                className={`${styles.results_image} absolute inset-0 object-cover w-full h-full`}
                src={adData.largeBanner.mediaItemUrl}
                alt={adData.largeBanner.altText}
                width={200}
                height={200}
              />
            ) : adData.smallBanner ? (
              <Image
                className={`${styles.results_image} absolute inset-0 object-cover w-full h-full`}
                src={adData.smallBanner.mediaItemUrl}
                alt={adData.smallBanner.altText}
                width={200}
                height={200}
              />
            ) : null}
          </a>
        ) : (
          <div className="card-ad__link">
            {adData.largeBanner ? (
              <Image
                className={`${styles.results_image} absolute inset-0 object-cover w-full h-full`}
                src={adData.largeBanner.mediaItemUrl}
                alt={adData.largeBanner.altText}
                width={200}
                height={200}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
