import styles from "./styles/page-gallery.module.scss";
import React, { useState } from "react";
import Container from "../components/container";
import PageSeparator from "../components/page-separator";
import parse from "html-react-parser";
import Image from "next/image";
import ModalImage from "react-modal-image";

export default function PageContent({ content }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setLightboxOpen(true);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxIndex(0);
  };

  if( !content ){
    return (
      <></>
    )
  }
  else{
    return (
      <Container>
        <section className="content my-6">
          <div className="content__inner grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {content.map((image, index) => (
              <div key={index} className={`${styles.outer} glisten`}>
                <div key={index} className={styles.wrapper}>
                  <ModalImage
                    small={image.mediaItemUrl}
                    large={image.mediaItemUrl}
                    alt={image.altText}
                    className={`${styles.image} glisten larger-link`}
                    hideDownload={true}
                    hideZoom={true}
                    onClick={() => openLightbox(index)}
                  />
                </div>
                <div className={`${styles.desc} text-center font-bold`}>
                  {parse(image.description ?? "")}
                </div>
              </div>
            ))}
          </div>
        </section>

        {lightboxOpen && (
          <ModalImage
            small={content[lightboxIndex].mediaItemUrl}
            large={content[lightboxIndex].mediaItemUrl}
            alt={content[lightboxIndex].altText}
            hideDownload={true}
            hideZoom={true}
            onClose={closeLightbox}
          />
        )}

        <h2 className="flex justify-center large-thank-you color-red">Thank you!</h2>

      </Container>
    );
  }
}
