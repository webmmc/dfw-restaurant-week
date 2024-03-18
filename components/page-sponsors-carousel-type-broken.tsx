import { Carousel } from "react-responsive-carousel";
import styles from "./styles/page-sponsors.module.scss";
import Container from "../components/container";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { CMS_NAME, CMS_URL } from "../lib/constants";

export default function Sponsors({ passedSponsors }) {
  const [carouselProps, setCarouselProps] = useState({});

  useEffect(() => {
    const updateCarouselProps = () => {
      const isMobile = window.innerWidth <= 500;
      const isTablet = window.innerWidth <= 1024;

      let centerSlidePercentage;

      if (isMobile) {
        centerSlidePercentage = 100 / 2;
      } else if (isTablet) {
        centerSlidePercentage = 100 / 4;
      } else {
        centerSlidePercentage = 100 / 8;
      }

      setCarouselProps({
        showArrows: true,
        showThumbs: false,
        showStatus: false,
        swipeable: true,
        emulateTouch: true,
        infiniteLoop: true,
        showIndicators: false,
        centerMode: true,
        centerSlidePercentage: centerSlidePercentage,
        selectedItem: 0,
        showSlideOnArrowHover: true,
        autoPlay: false,
        interval: 5000,
        stopOnHover: true,
        showLegend: false,
        width: "100%",
      });
    };

    updateCarouselProps();
    window.addEventListener("resize", updateCarouselProps);
    return () => window.removeEventListener("resize", updateCarouselProps);
  }, []);

  return (
    <Container>
      <section className={(styles.sponsors || "") + ""}>
        <div className={(styles.head || "") + " my-6"}>
          <div className={(styles.line || "") + " background-gray"}></div>
          <h2
            className={(styles.heading || "") + " color-gray text-center px-4"}
          >
            sponsors
          </h2>
        </div>

        <div className={(styles.sponsors__inner || "") + " flex flex-wrap"}>
          <Carousel {...carouselProps} showThumbs={false}>
            {passedSponsors.map((sponsor, index) => (
              <div key={index} className={styles.sponsor}>
                <Image
                  src={sponsor.image}
                  alt={sponsor.title ?? ""}
                  width={800}
                  height={600}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </section>
    </Container>
  );
}
