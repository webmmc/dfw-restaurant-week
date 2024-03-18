import styles from "./styles/home-hero-carousel.module.scss";
import Container from "../components/container";
import Image from "next/image";
import parse from "html-react-parser";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";


export default function HomeHeroCarousel({
  sliderData,
  featuredCharities,
}) {
  return (
    <Container>
      <section className="my-6 lg:my-12">
        <div className={(styles.hero || "") + " flex"}>
          <div id="hero-carousel" className={(styles.carousel || "") + " "}>
            {/* React slider component */}
            <Carousel infiniteLoop showThumbs={false} autoPlay={true} interval={5000}>
            {sliderData.map((slide, index) => (
              <div className={`${(styles.carousel__innerslide || "")}  ${(styles.carousel__innersliderelative || "")}`} key={slide?.slideMeta.headline}>
                {slide?.slideMeta.background && ( // Check if slideMeta.background is set
                  <div className={`${(styles.carousel__imagewrapper || "")}`}>
                    <Image
                      className={`${styles.image || ""} ${styles.imageRelative || ""}`}
                      src={slide.slideMeta.background.mediaItemUrl}
                      alt={slide.slideMeta.headline ?? slide.slideMeta.background.altText ?? ""}
                      width={1183}
                      height={534}
                      priority={index === 0 ? true : false}
                    />
                  </div>
                )}
                <a
                  href={slide?.slideMeta?.link?.url}
                  target={slide?.slideMeta?.link?.target}
                  className={`
                    ${(styles.carousel__info || "")}  
                    ${(styles.carousel__inforelative || "")}  
                    hero-carousel-info p-6 text-left glisten larger-link 
                    ${(slide?.text && slide.text.split(' ').length > 40 ? " "+(styles.carousel__info__l || "") : "")}
                    ${(slide?.text && slide.text.split(' ').length > 100 ? " "+(styles.carousel__info__xl|| "") : "")}
                  `}
                >
                  <h3 className="font-bold uppercase">{slide?.slideMeta?.headline}</h3>
                  <div>{slide?.text ?? ""}</div>
                  <hr />
                  <p className="site-btn site-btn--text px-0 font-sm">{slide?.slideMeta?.link?.title}</p>
                </a>
              </div>
            ))}

            </Carousel>
          </div>

          <div className={`${styles.charities || ""} ${styles.charitiesCarousel || ""}`}>
            <div className={(styles.charities__inner || "") + ""}>
              <h2 className={styles.charities__title || ""}>supporting</h2>
              {featuredCharities.map((charity, index) => (
                <div
                  key={index}
                  className={index === 0 ? "mr-4 lg:mb-4 lg:mr-0" : ""}
                >
                  <a
                    target="_blank"
                    href={charity?.link}
                    key={index}
                    className={
                      (styles.charity_item || "") + " glisten inline-block larger-link larger-link--noshadow"
                    }
                  >
                    <Image
                      src={charity?.charityLogo?.mediaItemUrl}
                      alt={charity?.charityName ?? ""}
                      width={226}
                      height={64}
                    />
                  </a>
                  <hr />
                  {parse(charity?.charityDescription ?? "")}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
