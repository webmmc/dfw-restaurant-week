import { useRef } from "react";
import ItineraryContext from "../context/ItineraryContext";
import styles from "./styles/home-hero-carousel.module.scss";
import Container from "../components/container";
import Image from "next/image";
import SignupForm from "../components/signup-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Link from 'next/link';
export default function HomeHeroCarousel({ restaurantData }) {
  const contactFormRef = useRef(null);

  return (
    <Container>
      <section className="my-6 lg:my-12">
        <div className={`${styles.hero || ""} flex `}>
          <div
            id="hero-page"
            className={`${styles.carousel || ""} ${styles.carousel_reverse_not || ""
              } `}
          >
            <Link
              className={`
                  ${styles.carousel__innerslide || ""} 
                  ${styles.this__ispage || ""}
                  larger-link glisten
                  `}
              href="/restaurants-list"


            >
              <Image
                className={`${styles.image || ""} ${styles.imageReservations || ""
                  }`}
                src={restaurantData.heroImage}
                alt={restaurantData.title ?? ""}
                width={1920}
                height={1920}
              />
            </Link>
          </div>

          <div className={styles.charities || ""}>
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
        </div>
      </section>
    </Container>
  );
}
