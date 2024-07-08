import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles/header.module.scss";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faYoutube,
  faPinterestP,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Squash as Hamburger } from "hamburger-react";
import ItineraryComponent from "../components/itinerary-component"; // Import the ItineraryComponent
import classNames from "classnames";

export default function Header({ mainMenu, socialMenu, rwLogo, audacyIcon }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [showItinerary, setShowItinerary] = useState(false); // State to control the visibility of the itinerary panel

  const socialIcons = {
    facebook: faFacebookF,
    instagram: faInstagram,
    twitter: faTwitter,
    youtube: faYoutube,
    pinterest: faPinterestP,
    tiktok: faTiktok,
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(
        currentScrollPos > 1 && currentScrollPos - prevScrollPos > 0
      );
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const handleToggleItinerary = () => {
    setShowItinerary((prevShowItinerary) => !prevShowItinerary);
  };

  return (
    <>
      <nav
        id="nav"
        className={classNames(styles.nav, {
          [styles["this--isscrolled"]]: isScrolled,
        })}
      >
        <Hamburger
          size={20}
          onToggle={(toggled) => {
            if (toggled) {
              document.querySelector("#menu").classList.add("this--open");
            } else {
              document.querySelector("#menu").classList.remove("this--open");
            }
          }}
        />

        <div
          className={classNames(
            styles.nav__inner,
            "max-w-6xl mx-auto flex justify-end"
          )}
        >
          <Link
            className={classNames(styles.logo__link, "glisten ml-0 mr-auto")}
            href="/"
          >
            <figure className={styles.logo}>
              <Image
                src={rwLogo}
                alt="Restaurant Week Logo"
                width={800}
                height={600}
              />
            </figure>
          </Link>
          <div
            className={classNames(
              styles.nav__items,
              "flex flex-col justify-between"
            )}
          >
            <ul
              id="social-icons"
              className={classNames(
                styles.social,
                "flex justify-end items-center"
              )}
            >
              {socialMenu?.menuItems.nodes.map((item, index) => (
                <li
                  className={classNames(styles.social__item, "ml-3")}
                  key={index}
                >
                  <a
                    className={classNames(styles.social__link, "glisten")}
                    href={item.url}
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={socialIcons[item.label]} />
                  </a>
                </li>
              ))}
              <li
                className={classNames(
                  styles.social__item,
                  "ml-6 mr-2",
                  styles.social__audacy
                )}
              >
                <a
                  className={classNames(styles.social__link, "glisten")}
                  target="_blank"
                  href="https://www.audacy.com/"
                >
                  <Image
                    src={audacyIcon}
                    alt="Restaurant Week Logo"
                    width={72}
                    height={72}
                  />
                </a>
              </li>
            </ul>

            <ul
              id="menu"
              className={classNames(styles.menu, styles.hidden_container)}
            >
              {mainMenu?.menuItems.nodes.map((item, index) => (
                <li
                  className=""
                  key={index}
                >
                  <Link
                    className={classNames(
                      "site-btn site-btn--text glisten",
                      styles.menu__link
                    )}
                    href={item.url}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Button to toggle itinerary panel */}
          <div className="flex items-end mx-4 my-2 sm:my-0  justify-center sm:justify-end">
            <button
              className={classNames(
                "site-btn site-btn--primary",
                styles.itineraryButton
              )}
              onClick={handleToggleItinerary}
              id="itbutton"
            >
              
              <svg className={`${styles.forkButton}`} version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="126.000000pt" height="158.000000pt" viewBox="0 0 126.000000 158.000000"
                preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,158.000000) scale(0.100000,-0.100000)"
                fill="#777" stroke="none">
                <path d="M247 1422 c-15 -17 -17 -75 -17 -625 0 -594 0 -607 20 -627 18 -18
                33 -20 179 -20 136 0 160 2 165 16 3 9 6 94 6 189 l0 173 -35 21 c-52 31 -85
                106 -85 196 0 137 22 530 31 540 6 5 9 3 9 -6 1 -58 30 -463 34 -466 16 -17
                24 26 30 174 8 202 17 303 25 303 4 0 12 -106 19 -235 13 -232 17 -265 32
                -265 9 0 15 57 31 318 7 100 15 182 19 182 8 0 20 -201 20 -349 0 -104 10
                -146 28 -126 5 6 14 96 21 200 24 374 38 365 47 -30 8 -338 5 -357 -62 -424
                l-44 -44 0 -178 c0 -98 4 -180 8 -183 15 -9 154 15 211 36 85 31 153 106 183
                200 22 70 23 87 23 393 0 340 -5 384 -50 475 -28 55 -75 100 -134 130 -77 38
                -176 49 -447 50 -231 0 -252 -1 -267 -18z"/>
                </g>
              </svg>
              Itinerary
            </button>
          </div>
        </div>
      </nav>
      {/* Sliding itinerary panel */}
      <div
        className={classNames(styles.itineraryPanel, {
          ["this--itiopen"]: showItinerary,
        })}
      >
        <div className={styles.itineraryContent}>
          <button
            className={`site-btn ${styles.closeButton}`}
            onClick={handleToggleItinerary}
          >
            X
          </button>
          <ItineraryComponent />
        </div>
      </div>
    </>
  );
}
