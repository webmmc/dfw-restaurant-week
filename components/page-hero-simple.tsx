import styles from "./styles/home-hero-carousel.module.scss";
import Container from "../components/container";
import Image from "next/image";
import { useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"
import SignupForm from "../components/signup-form";


import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function SimplePageHero({ pageData, slugType= '' }) {
  const contactFormRef = useRef(null);
  return (
    <Container>
      <section className="my-6 lg:my-12">
        <div className={(styles.hero || "") + " flex gap-x-4"}>
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
              { slugType === 'contact' &&     <div className={styles.charities || ""}>
            <div
              className={`
              ${styles.charities__inner || ""} 
              ${styles.page__inner || ""}
              ${styles.reservations__inner || ""}
            `}
            >
              <h2 className={styles.charities__title || ""}>in the know</h2>
              <>
                <h3 className="uppercase smaller-line-height mb-6">
                  <span className="text-red">Get updates on</span> DFW
                  Restaurant Week
                </h3>
                <div className={`${styles.contactFormEmbed || ""}`}>
                  <SignupForm
                    ref={contactFormRef}
                    onSubmit={async (formData) => {
                      const res = await axios.post(
                        "https://restaurantcms2.wpenginepowered.com/wp-json/contact-form-7/v1/contact-forms/1396/feedback",
                        formData,
                        {
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        }
                      );
                      if (
                        res.status === 200 &&
                        res.statusText === "OK" &&
                        res.data.status === "mail_sent"
                      ) {
                        const message =
                          res.data.message || "Message sent successfully";
                        toast.success(message);
                        // reset form
                        contactFormRef.current.resetForm();
                      } else {
                        const status = res.data.status || "error";
                        const message =
                          res.data.message || "Something went wrong";
                        toast.error(status + ": " + message);
                        console.error("res", res);
                      }
                    }}
                  />
                </div>
                <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={true}
                  closeOnClick={true}
                />
              </>
            </div>
          </div>

              }
      
        </div>
      </section>
    </Container>
  );
}
