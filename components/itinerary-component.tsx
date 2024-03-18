import { useContext, useState } from "react";
import ItineraryContext from "../context/ItineraryContext";
import ReservationModal from "./ReservationModal";
import Link from "next/link";
import styles from "./styles/header.module.scss";

import type { Restaurant } from "../context/ItineraryContext";

export default function ItineraryComponent() {
  const { itinerary, setItinerary } = useContext(ItineraryContext);
  const [modalOpen, setModalOpen] = useState(false); // State to control the modal visibility
  const [modalSrc, setModalSrc] = useState(""); // State to store the reservation link

  const removeFromItinerary = (slug) => {
    setItinerary((prevItinerary: Restaurant[]) => {
      return prevItinerary.filter((restaurant) => restaurant.slug !== slug);
    });
  };

  const openModal = (src) => {
    setModalOpen(true);
    setModalSrc(src);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalSrc("");
  };

  return (
    <div className="p-6">
      <div className="mb-8 ">
        <h2 className="color-graytext-center">Itinerary</h2>
        <p>
          <Link className="" href="/reservations#start">
            Find restaurants
          </Link>{" "}
          to add to your itinerary.
        </p>
      </div>
      <ul className={styles.itineraryScrollbox}>
        {itinerary.map((restaurant, index) => (
          <li key={index}>
            <div className="flex items-center justify-between">
              <div className={styles.itineraryName}>
                <h4>
                  <Link href={`/restaurants/${restaurant.slug}`}>
                    {restaurant.title}
                  </Link>
                </h4>
              </div>
              <div className="flex">
                <button
                  className="site-btn site-btn--primary desktop-button font-sm mr-2"
                  onClick={() =>
                    openModal(
                      `https://www.opentable.com/restref/client/?rid=${restaurant.openTableLink}&restref=2489&lang=en-US`
                    )
                  }
                >
                  Find a table
                </button>
                <button
                  className="site-btn site-btn--secondary desktop-button font-sm"
                  onClick={() => removeFromItinerary(restaurant.slug)}
                >
                  Remove
                </button>
              </div>
            </div>
            <hr />
          </li>
        ))}
      </ul>
      {/* Modal */}
      {modalOpen && (
        <ReservationModal
          closeModal={closeModal}
          modalSrc={modalSrc}
          iframeClassNames=""
        />
      )}
    </div>
  );
}
