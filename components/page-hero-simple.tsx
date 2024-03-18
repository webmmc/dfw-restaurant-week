import styles from "./styles/home-hero-carousel.module.scss";
import Container from "../components/container";
import Image from "next/image";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function SimplePageHero({ pageData }) {
  return (
    <Container>
      <section className="my-6 lg:my-12">
        <div className={(styles.hero || "") + " flex flex-row-reverse"}>
          <div
            id="hero-page"
            className={` 
              ${styles.carousel || ""}
              ${styles.carousel_reverse || ""}
              ${styles.carousel_simple || ""}
            `}
          >
            <div
              className={`${styles.carousel__innerslide || ""} ${
                styles.this__ispage || ""
              } ${styles.this__issimple || "" || ""}`}
            >
              {pageData.heroVideoUrl ? (
                <div className={`${styles.video_container || ""}`}>
                  <iframe
                    className={`${styles.video || ""}`}
                    src={`${pageData.heroVideoUrl}&controls=0&autoplay=1&loop=1&autopause=0&muted=1`}
                    title="Hero Video"
                    width={1920}
                    height={1080}
                    allowFullScreen
                  />
                </div>
              ) : (
                <Image
                  className={`${styles.image_grow || ""}`}
                  src={
                    pageData.heroImage ? pageData.heroImage : pageData.thumbnail
                  }
                  alt={pageData.title ?? ""}
                  width={1920}
                  height={1920}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
