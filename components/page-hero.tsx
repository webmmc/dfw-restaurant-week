import React, { useContext, useState } from "react";
import ItineraryContext from "../context/ItineraryContext";
import styles from "./styles/home-hero-carousel.module.scss";
import Container from "../components/container";
import ReservationModal from "../components/ReservationModal";
import Image from "next/image";

export default function HomeHeroCarousel({ restaurantData }) {
  const { itinerary, setItinerary } = useContext(ItineraryContext);
  const [modalOpen, setModalOpen] = useState(false); // State to control the modal visibility
  const [modalSrc, setModalSrc] = useState(""); // State to store the reservation link

  const handleAddToItinerary = () => {
    const newRestaurant = {
      slug: restaurantData.slug,
      title: restaurantData.title,
      openTableLink: restaurantData.openTableLink,
    };

    const isRestaurantInItinerary = itinerary.some(
      (restaurant) => restaurant.slug === newRestaurant.slug
    );

    if (!isRestaurantInItinerary) {
      setItinerary((prevItinerary) => [...prevItinerary, newRestaurant]);
    }
  };

  const handleAlreadyIn = () => {
    document.querySelector("#itbutton").classList.add("this--highlight");
    setTimeout(() => {
      document.querySelector("#itbutton").classList.remove("this--highlight");
    }, 550);
  };

  const isRestaurantInItinerary = itinerary.some(
    (restaurant) => restaurant.slug === restaurantData.slug
  );

  const openModal = (src) => {
    setModalOpen(true);
    setModalSrc(src);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalSrc("");
  };

  return (
    <Container>
      <section className="my-6 lg:my-12">
        <div className={`${styles.hero || ""} flex flex-row-reverse`}>
          <div
            id="hero-page"
            className={`${styles.carousel || ""} ${
              styles.carousel_reverse || ""
            } `}
          >
            <div
              className={`${styles.carousel__innerslide || ""} ${
                styles.this__ispage || ""
              }`}
            >
              <Image
                className={`${styles.image || ""}`}
                src={restaurantData.thumbnail}
                alt={restaurantData.title ?? ""}
                width={1920}
                height={1920}
              />
            </div>
          </div>

          <div className={styles.charities || ""}>
            <div
              className={`${styles.charities__inner || ""} ${
                styles.page__inner || ""
              }`}
            >
              <div className={styles.charity_item || ""}>
                {restaurantData.logo && (
                  <Image
                    className={`${styles.page__logo || ""} pb-8`}
                    src={restaurantData.logo}
                    alt={restaurantData.title ?? ""}
                    width={1920}
                    height={1920}
                  />
                )}
                {!restaurantData.logo && (
                  <h1 className="uppercase">{restaurantData.title}</h1>
                )}
                <p>{restaurantData.address}</p>
                {restaurantData.phone && <p>Phone: {restaurantData.phone}</p>}
                {restaurantData.dresscode && (
                  <p>Dresscode: {restaurantData.dresscode}</p>
                )}
              </div>

              <div className={`${styles.pagedivider || ""} bg-gray`}></div>

              {restaurantData.openTable ? (
                <div className={`${styles.opentablesection || ""}`}>
                  <Image
                    className={`${styles.page__open || ""} mt-8 mb-4`}
                    src="https://restaurantcms2.wpenginepowered.com/wp-content/uploads/2023/05/opentable-logo-153e80.png"
                    alt="Open Table Logo"
                    width={1920}
                    height={1920}
                  />
                  <button
                    className="site-btn site-btn--primary mr-2 my-2 lg:my-4 lg:mx-0"
                    onClick={() =>
                      openModal(
                        `https://www.opentable.com/restref/client/?rid=${restaurantData.openTableLink}&restref=2489&lang=en-US`
                      )
                    }
                  >
                    Find a Table
                  </button>
                  <button
                    className={`site-btn site-btn--secondary ${
                      isRestaurantInItinerary ? styles.added : ""
                    }`}
                    onClick={() => {
                      if (!isRestaurantInItinerary) {
                        handleAddToItinerary();
                        handleAlreadyIn();
                      } else {
                        handleAlreadyIn();
                      }
                    }}
                  >
                    {isRestaurantInItinerary
                      ? "In Itinerary"
                      : "Add to itinerary"}
                  </button>
                </div>
              ) : (
                <div className={`${styles.opentablesection || ""}`}>
                  <h4 className="uppercase"> Make a reservation </h4>
                  <p>
                    <a href={restaurantData.website}>
                      {restaurantData.title} Website
                    </a>
                  </p>
                </div>
              )}

              {/* Modal */}
              {modalOpen && (
                <ReservationModal
                  closeModal={closeModal}
                  modalSrc={modalSrc}
                  iframeClassNames=""
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
