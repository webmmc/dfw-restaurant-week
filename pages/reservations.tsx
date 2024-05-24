import React, { useContext, useState, useEffect } from "react";
import ItineraryContext from "../context/ItineraryContext";
import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Container from "../components/container";
import PageSeparator from "../components/page-separator";
import PageAd from "../components/page-ad";
import ReservationsHero from "../components/page-hero-reservations";

import styles from "../components/styles/restaurant-filter.module.scss";

import { getRestaurantFilterObjects } from "../lib/api";
import Main from "../components/main";
import Layout from "../components/layout";
import PostTitle from "../components/post-title";
import CardAd from "../components/card-ad";
import ReservationModal from "../components/ReservationModal";
import Map from "../components/map";
import { MultiSelect } from "react-multi-select-component";
import SearchInput from "../components/searchInput";

export default function RestaurantFilter({
  topAd,
  bottomAd,
  restuarantFilterObjs: {
    cuisines,
    diningSelections,
    locations,
    weeksParticipating,
    curatedCollections,
    restaurants,
    mainMenu,
    footerMenu,
    socialMenu,
  },
  preview: boolean,
}) {
  /*
  const diningSelectionTaxonomies = diningSelections?.edges?.map(
    ({ node }) => node?.slug
  );
  const cuisineTaxonomies = cuisines?.edges?.map(({ node }) => node?.slug);
  const locationTaxonomies = locations?.edges?.map(({ node }) => node?.slug);
  const weekTaxonomies = weeksParticipating?.edges?.map(
    ({ node }) => node?.slug
  );
  const curatedCollectionTaxonomies = curatedCollections?.edges?.map(
    ({ node }) => node?.slug
  );
  const combinedTaxonomies = [
    ...cuisineTaxonomies,
    ...diningSelectionTaxonomies,
    ...locationTaxonomies,
    ...weekTaxonomies,
    ...curatedCollectionTaxonomies,
  ]; */

  const { itinerary, setItinerary } = useContext(ItineraryContext);

  const handleAddToItinerary = (slug, title, openTableLink) => {
    const newRestaurant = {
      slug: slug,
      title: title,
      openTableLink: openTableLink,
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

  const router = useRouter();
  const [taxonomyFilters, setTaxonomyFilters] = useState(new Set<string>());
  const [cuisineFilters, setCuisineFilters] = useState(new Set<string>());
  const [curatedCollectionsFilters, setCuratedCollectionsFilters] = useState(new Set<string>());
  const [locationFilters, setLocationFilters] = useState(new Set<string>());
  const [fullListChecked, setFullListChecked] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const [mapfilters, setMapFilters] = useState([]);
  const [searchfilters, setSearchFilters] = useState([]);
  const [weeklyParticipatingSelected, setWeeklyParticipatingSelected] = useState([]);
  const [cuisinesSelected, setCuisinesSelected] = useState([]);
  const [curatedSelected, setCuratedSelected] = useState([]);
  const [search, setSearch] = useState<string>('');
  const cuisineFiltersArray = Array.from(cuisineFilters);
  const curatedCollectionsFiltersArray = Array.from(curatedCollectionsFilters);
  const locationFiltersArray = Array.from(locationFilters);

  const taxonomyFiltersArray = Array.from(taxonomyFilters);
  const taxonomyOrFiltersArray = [
    ...curatedCollectionsFiltersArray,
    ...cuisineFiltersArray,
    ...locationFiltersArray,
  ];

  const selectedDiningSelections = diningSelections?.edges?.filter(
    ({ node }) => {
      return taxonomyFiltersArray.includes(node?.slug);
    }
  );
  const selectedDiningSelectionsLast =
    selectedDiningSelections[selectedDiningSelections.length - 1];

  const locationsAndCuratedCollections = [
    ...locations?.edges,
    ...curatedCollections?.edges,
  ];

  const selectedLocationsOrCuratedCollections =
    locationsAndCuratedCollections?.filter(({ node }) => {
      return taxonomyFiltersArray.includes(node?.slug);
    });
  const selectedLocationsOrCuratedCollectionsLast =
    selectedLocationsOrCuratedCollections[
      selectedLocationsOrCuratedCollections.length - 1
    ];

  function updateFilters(checked, taxonomyFilter, filterType = "") {
    setMapFilters([]);
    if (checked) {
     
      if (taxonomyFilter === "full-list") {
        setTaxonomyFilters(new Set<string>());
        setFullListChecked(true);
        return;
      }
      // if full list is checked while checking other filter items, uncheck it
      if (fullListChecked) {
        setFullListChecked(false);
      }
      setTaxonomyFilters((prev) => new Set(prev).add(taxonomyFilter));
      if (filterType === "cuisine") {
        setCuisineFilters((prev) => new Set(prev).add(taxonomyFilter));
      }
      if (filterType === "location") {
        setLocationFilters((prev) => new Set(prev).add(taxonomyFilter));
      }
      if (filterType === "curatedCollection") {
        setCuratedCollectionsFilters((prev) =>
          new Set(prev).add(taxonomyFilter)
        );
      }
    }
    if (!checked) {
    
      if (taxonomyFilter === "full-list") {
        setTaxonomyFilters(new Set<string>());
        setFullListChecked(false);
        return;
      }
      setTaxonomyFilters((prev) => {
        const next = new Set(prev);
        next.delete(taxonomyFilter);
        return next;
      });
      if (filterType === "cuisine") {
        setCuisineFilters((prev) => {
          const next = new Set(prev);
          next.delete(taxonomyFilter);
          return next;
        });
      }
      if (filterType === "location") {
        setLocationFilters((prev) => {
          const next = new Set(prev);
          next.delete(taxonomyFilter);
          return next;
        });
      }
      if (filterType === "curatedCollection") {
        setCuratedCollectionsFilters((prev) => {
          const next = new Set(prev);
          next.delete(taxonomyFilter);
          return next;
        });
      }
    }
  }

  let filteredRestaurants = restaurants?.edges
    ?.filter(({ node }) => {
      const restaurantCuisines = node?.cuisines?.edges?.map(
        ({ node: taxonomy }) => taxonomy?.slug
      );
      const restaurantDiningSelections = node?.diningSelections?.edges?.map(
        ({ node: taxonomy }) => taxonomy?.slug
      );
      const restaurantLocations = node?.locations?.edges?.map(
        ({ node: taxonomy }) => taxonomy?.slug
      );
      const restaurantWeeksParticipating = node?.weeksParticipating?.edges?.map(
        ({ node: taxonomy }) => taxonomy?.slug
      );
      const restaurantCuratedCollections = node?.curatedCollections?.edges?.map(
        ({ node: taxonomy }) => taxonomy?.slug
      );

      const restaurantTaxonomies = [
        ...restaurantDiningSelections,
        ...restaurantWeeksParticipating,
        ...restaurantCuratedCollections,
      ];

      const taxonomyAndFiltersArray = taxonomyFiltersArray.filter(
        (filter) => !taxonomyOrFiltersArray.includes(filter)
      );

      return taxonomyOrFiltersArray.length === 0
        ? taxonomyAndFiltersArray.every((taxonomy) =>
            restaurantTaxonomies.includes(taxonomy)
          )
        : taxonomyAndFiltersArray.every((taxonomy) =>
            restaurantTaxonomies.includes(taxonomy)
          ) &&
            (cuisineFiltersArray.length !== 0
              ? cuisineFiltersArray.some((taxonomy) =>
                  restaurantCuisines.includes(taxonomy)
                )
              : true) &&
            (locationFiltersArray.length !== 0
              ? locationFiltersArray.some((taxonomy) =>
                  restaurantLocations.includes(taxonomy)
                )
              : true) &&
            (curatedCollectionsFiltersArray.length !== 0
              ? curatedCollectionsFiltersArray.some((taxonomy) =>
                  restaurantCuratedCollections.includes(taxonomy)
                )
              : true);
    })
    .filter(({ node }) => {
      if (mapfilters.length > 0) {
        return mapfilters.some((item) => item?.node?.id === node.id);
      }
      return true;
    })
    .filter(({ node }) => {
      if (search) {
        return searchfilters.some((item) => item?.node?.id === node.id);
      }
      return true;
    })
    .sort((a, b) => {
      const titleA = a.node.title.toLowerCase();
      const titleB = b.node.title.toLowerCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });

  const allRestaurants = restaurants?.edges;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = () => {
    setExpanded(!isExpanded);
  };
  const handleOpenClick = (name) => {
    setExpanded(true);
  };
  const handleCloseClick = () => {
    setExpanded(false);
  };

  const openModal = (src) => {
    setModalOpen(true);
    setModalSrc(src);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalSrc("");
  };

  const pageData = {
    heroImage:
      "http://rw-cms.moritz.work/wp-content/uploads/2023/07/Full-List-Image-01-1.jpg",
  };

  const handleRestaurantChange = (restaurants: any) => {
    const updatedData = allRestaurants.filter((marker) =>
      restaurants.some((restaurant) => restaurant.id === marker?.node?.id)
    );
    setMapFilters(updatedData);
  };

  const cuisinesOptions = cuisines?.edges?.map((item) => {
    const { node } = item;
    return {
      label: node?.name,
      value: node?.slug,
      id: node?.id,
    };
  });

  const weeklyParticipatingOptions = weeksParticipating?.edges?.map((item) => {
    const { node } = item;
    return {
      label: node?.name,
      value: node?.slug,
      id: node?.id,
    };
  });

  const curatedCollectionsOptions = curatedCollections?.edges?.map((item) => {
    const { node } = item;
    return {
      label: node?.name,
      value: node?.slug,
      id: node?.id,
    };
  });


  const handleSearch = (value:string)=>{
    const values =  allRestaurants.filter(restaurant => 
      restaurant.node.title.toLowerCase().includes(value.toLowerCase())
    );   
    setSearchFilters(values)    
  }

console.log('the filtered data has', filteredRestaurants);

 
  return (
    <>
      <Layout
        mainMenu={mainMenu?.nodes[0]}
        footerMenu={footerMenu?.nodes[0]}
        socialMenu={socialMenu?.nodes[0]}
        preview={boolean}
      >
        <Head>
          <title>{`DFW Restaurant Week Reservations`}</title>
        </Head>
        <Main>
          <PageAd adData={topAd} />
          <ReservationsHero restaurantData={pageData} />
          <Container>
            {router.isFallback ? (
              <PostTitle>Loading…</PostTitle>
            ) : (
              <div className={styles.filters}>
                {/* Dining Selections */}
                <div className={`flex items-center py-3 ${styles.header}`}>
                  <div className={`flex ${styles.line}`}></div>
                  <div className={`flex ${styles.icon}`}>
                    <Image
                      className={`${styles.image || ""}`}
                      src={
                        "https://rw-cms.moritz.work/wp-content/uploads/2023/06/filter-icon.png"
                      }
                      alt=""
                      width={50}
                      height={40}
                    />
                  </div>
                  <h3
                    id="start"
                    className={`flex ${styles.headline} uppercase`}
                  >
                    {" "}
                    BOOK YOUR RESERVATION AND PLAN YOUR RESTAURANT WEEK WITH A
                    PERSONALIZED ITINERARY{" "}
                  </h3>
                </div>
                <div
                  className={`grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5 lg:gap-x-8 ${styles.selection_filter}`}
                >
                  {diningSelections?.edges?.map(
                    ({ node: diningItem }, index) => {
                      return (
                        <div
                          className={`form-check glisten larger-link ${styles.dining_item}`}
                          key={diningItem.id}
                        >
                          <label
                            className={`form-check-label ${styles.dining_label}`}
                            role="button"
                          >
                            {diningItem?.categoryAds?.categoryImg
                              ?.mediaItemUrl && (
                              <Image
                                src={
                                  diningItem?.categoryAds?.categoryImg
                                    ?.mediaItemUrl
                                }
                                className={`${styles.dining_img} absolute inset-0 object-cover w-full h-full`}
                                alt={
                                  diningItem?.categoryAds?.categoryImg?.altText
                                }
                                width={400}
                                height={400}
                              />
                            )}
                            <span
                              className={`site-btn site-btn--text flex ${styles.dining_input}`}
                            >
                              <input
                                className={`${styles.select_button} form-check-input`}
                                type="checkbox"
                                checked={
                                  taxonomyFilters.has(diningItem?.slug) &&
                                  !fullListChecked
                                }
                                onChange={(e) =>
                                  updateFilters(
                                    e.target.checked,
                                    diningItem?.slug
                                  )
                                }
                              />
                              <span
                                className={`p-1 ${styles.dining_input_text}`}
                              >
                                {diningItem?.name}
                              </span>
                            </span>
                          </label>
                        </div>
                      );
                    }
                  )}
                </div>
                <div
                  className={`expander-section lg:flex lg:flex-row align-center justify-center bg-black mt-4 ${styles.expaner} `}
                >
                  {/* <div className="p-2 hidden  not-md:block">
                    <button
                      className="w-full lg:w-auto site-btn site-btn--primary lg:px-8"
                      // onClick={() => handleOpenClick("location")}
                      onClick={() => handleButtonClick()}
                    >
                      Location{" "}
                      <span className={styles.expand_arrow}>&#8679;</span>{" "}
                    </button>
                  </div>
                  <div className="p-2 hidden  not-md:block">
                    <button
                      className="w-full lg:w-auto site-btn site-btn--primary lg:px-8"
                      // onClick={() => handleOpenClick("cuisine")}
                      onClick={() => handleButtonClick()}
                    >
                      Cuisine{" "}
                      <span className={styles.expand_arrow}>&#8679;</span>{" "}
                    </button>
                  </div> */}
                  {/* <div className="p-2 hidden  not-md:block ">
                    <button
                      className="w-full lg:w-auto site-btn  lg:px-8"
                      // onClick={() => handleOpenClick("weeks")}
                      onClick={() => handleButtonClick()}
                    >
                      Weeks Participating{" "}
                      <span className={styles.expand_arrow}>&#8679;</span>{" "}
                    </button>
                  </div> */}
                  <div className="p-2 not-md:hidden">
                    <div
                      className={`w-full lg:w-auto ${styles.siteFiltersHeading} flex justify-center lg:px-8`}
                    >
                      MAP VIEW FILTER
                      <span className="hidden md:inline-block">
                        &nbsp; BY CUISINES, CURATED COLLECTIONS & WEEK
                        PARTICIPATING
                      </span>
                    </div>
                  </div>
                </div>
                {/* <div
                  className={`${styles.expanded_filters} expanded relative ${
                    isExpanded ? "this--expanded" : ""
                  }`}
                >
                  <button
                    className="absolute top-0 right-0 m-4 site-btn"
                    onClick={handleCloseClick}
                  >
                    &#8679;
                    <span className="sr-only">Close</span>
                  </button>

                  <div
                    className={`${styles.filterMaxWidth} mt-4 pb-4 flex flex-col sm:flex-row items-start flex-wrap justify-start`}
                  >
                    
                    <div className="flex flex-col px-2  py-4  pr-8 border-l-2 border-gray">
                      <h4 className="mt-4 md:mt-0">Cuisine</h4>
                      <div
                        className={`${styles.filter_list} ${styles.cuisines}  cuisines-list-cuisines`}
                      >
                        {cuisines?.edges?.map(
                          ({ node: cuisineItem }, index) => {
                            return (
                              <div
                                className="form-check ms-2"
                                key={cuisineItem.id}
                              >
                                <label
                                  className={`form-check-label flex items-start my-2 ${styles.line_height}`}
                                >
                                  <input
                                    className="form-check-input mx-1"
                                    type="checkbox"
                                    checked={
                                      taxonomyFilters.has(cuisineItem?.slug) &&
                                      !fullListChecked
                                    }
                                    onChange={(e) =>
                                      updateFilters(
                                        e.target.checked,
                                        cuisineItem?.slug,
                                        "cuisine"
                                      )
                                    }
                                  />
                                  {cuisineItem?.name}
                                </label>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col px-2  py-4  pr-8 border-l-2 border-gray">
                      <h4 className="mt-4 md:mt-0">Weeks Participating</h4>
                      <div
                        className={`${styles.filter_list} ${styles.weeks}  filter-list-weeks`}
                      >
                        {weeksParticipating?.edges?.map(
                          ({ node: weekItem }, index) => {
                            return (
                              <div
                                className="form-check ms-2"
                                key={weekItem.id}
                              >
                                <label
                                  className={`form-check-label flex items-start my-2 ${styles.line_height}`}
                                >
                                  <input
                                    className="form-check-input mx-1"
                                    type="checkbox"
                                    checked={
                                      taxonomyFilters.has(weekItem?.slug) &&
                                      !fullListChecked
                                    }
                                    onChange={(e) => {
                                      console.log(
                                        " e.target.checked",
                                        e.target.checked
                                      );
                                      console.log(
                                        "weekItem?.slug",
                                        weekItem?.slug
                                      );
                                      updateFilters(
                                        e.target.checked,
                                        weekItem?.slug
                                      );
                                    }}
                                  />
                                  {weekItem?.name}
                                </label>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                // <div
                //   className={`flex flex-col mt-4 bg-red my-4 mb-4 ${styles.curated_collections}`}
                // >
                //   <h4 className="sr-only text-center">Curated Collections</h4>
                //   <div
                //     className={`${styles.collections_container} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 p-3`}
                //   >
                //     {curatedCollections?.edges?.map(
                //       ({ node: curatedCollectionItem }) => {
                //         return (
                //           <div
                //             className="form-check ms-2"
                //             key={curatedCollectionItem.id}
                //           >
                //             <label
                //               className={`${styles.curated_label} form-check-label flex items-center uppercase font-bold`}
                //             >
                //               <input
                //                 className="form-check-input mx-1"
                //                 type="checkbox"
                //                 checked={
                //                   taxonomyFilters.has(
                //                     curatedCollectionItem?.slug
                //                   ) && !fullListChecked
                //                 }
                //                 onChange={(e) =>
                //                   updateFilters(
                //                     e.target.checked,
                //                     curatedCollectionItem?.slug
                //                   )
                //                 }
                //               />
                //               <span className={`${styles.curated_label_text}`}>
                //                 {curatedCollectionItem?.name}
                //               </span>
                //             </label>
                //           </div>
                //         );
                //       }
                //     )}
                //   </div>
                // </div> */}

                <div className={styles.dropdown_main_container}>
                  <div className="flex flex-col items-center">
                    <p className="text-center pt-3 font-bold">
                      Powered by Dallas Symphony Orchestra.
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 sm:gap-2 md:gap-x-16 lg:grid-cols-4 lg:gap-x-16 xl:gap-x-30 pb-10 ">
                      <div className="xl:w-60 lg:w-40 sm:w-64">
                        <MultiSelect
                          options={cuisinesOptions}
                          value={cuisinesSelected}
                          hasSelectAll={false}
                          valueRenderer={(selected, _options) => {
                            return selected.length
                              ? `Cuisines: ${selected.map(
                                  ({ label }) => label
                                )}`
                              : "";
                          }}
                          onChange={(values: any) => {
                            if (!values.length) {
                              const valuesToExclude: string[] =
                                cuisinesOptions.map((item) => item.value);
                              const ExcludedSet: Set<string> = new Set(
                                Array.from(taxonomyFilters).filter(
                                  (value) => !valuesToExclude.includes(value)
                                )
                              );
                              setCuisineFilters(new Set<string>());
                              setTaxonomyFilters(ExcludedSet);
                            } else {
                              const newSelected = values.filter(
                                (value: any) =>
                                  !cuisinesSelected.some(
                                    (cuisine) => cuisine.id === value.id
                                  )
                              );

                              const deSelected = cuisinesSelected.filter(
                                (value) =>
                                  !values.some(
                                    (cuisine: any) => cuisine.id === value.id
                                  )
                              );

                              if (newSelected.length) {
                                updateFilters(
                                  true,
                                  newSelected[0]?.value,
                                  "cuisine"
                                );
                              }

                              if (deSelected.length) {
                                updateFilters(
                                  false,
                                  deSelected[0]?.value,
                                  "cuisine"
                                );
                              }
                            }
                            setCuisinesSelected(values);
                          }}
                          labelledBy="Cuisines"
                          overrideStrings={{ selectSomeItems: "Cuisines" }}
                        />
                      </div>
                      <div className="xl:w-60 lg:w-40 sm:w-64">
                        <MultiSelect
                          options={curatedCollectionsOptions}
                          value={curatedSelected}
                          hasSelectAll={false}
                          valueRenderer={(selected, _options) => {
                            return selected.length
                              ? `Curated Collections: ${selected.map(
                                  ({ label }) => label
                                )}`
                              : "";
                          }}
                          onChange={(values: any) => {
                            if (!values.length) {
                              const valuesToExclude: string[] =
                                curatedCollectionsOptions.map(
                                  (item) => item.value
                                );
                              const ExcludedSet: Set<string> = new Set(
                                Array.from(taxonomyFilters).filter(
                                  (value) => !valuesToExclude.includes(value)
                                )
                              );
                              setCuratedCollectionsFilters(new Set<string>());
                              setTaxonomyFilters(ExcludedSet);
                            } else {
                              const newSelected = values.filter(
                                (value: any) =>
                                  !curatedSelected.some(
                                    (collection) => collection.id === value.id
                                  )
                              );

                              const deSelected =
                              curatedSelected.filter(
                                  (value) =>
                                    !values.some(
                                      (collection: any) =>
                                        collection.id === value.id
                                    )
                                );

                              if (newSelected.length) {
                                updateFilters(
                                  true,
                                  newSelected[0]?.value,
                                  "curatedCollection"
                                );
                              }

                              if (deSelected.length) {
                                updateFilters(
                                  false,
                                  deSelected[0]?.value,
                                  "curatedCollection"
                                );
                              }
                            }
                            setCuratedSelected(values);
                          }}
                          labelledBy="Curated Collections"
                          overrideStrings={{
                            selectSomeItems: "Curated Collections",
                          }}
                        />
                      </div>
                      <div className="xl:w-60 lg:w-40 sm:w-64">
                        <MultiSelect
                          options={weeklyParticipatingOptions}
                          value={weeklyParticipatingSelected}
                          valueRenderer={(selected, _options) => {
                            return selected.length
                              ? `Week Participating: ${selected.map(
                                  ({ label }) => label
                                )}`
                              : "";
                          }}
                          hasSelectAll={false}
                          onChange={(values: any) => {
                            if (!values.length) {
                              const valuesToExclude: string[] =
                                weeklyParticipatingOptions.map(
                                  (item) => item.value
                                );
                              const ExcludedSet: Set<string> = new Set(
                                Array.from(taxonomyFilters).filter(
                                  (value) => !valuesToExclude.includes(value)
                                )
                              );
                              setTaxonomyFilters(ExcludedSet);
                            } else {
                              const newSelected = values.filter(
                                (value: any) =>
                                  !weeklyParticipatingSelected.some(
                                    (week) => week.id === value.id
                                  )
                              );

                              const deSelected =
                                weeklyParticipatingSelected.filter(
                                  (value) =>
                                    !values.some(
                                      (week: any) => week.id === value.id
                                    )
                                );

                              if (newSelected.length) {
                                updateFilters(true, newSelected[0]?.value);
                              }

                              if (deSelected.length) {
                                updateFilters(false, deSelected[0]?.value);
                              }
                            }
                            setWeeklyParticipatingSelected(values);
                          }}
                          labelledBy="Week Participating"
                          overrideStrings={{
                            selectSomeItems: "Week Participating",
                          }}
                        />
                      </div>
                      <div className="xl:w-60 lg:w-40">
                      <SearchInput
                      label="Search..."
                      handleSearch={(value:string)=>{
                        setSearch(value);
                        handleSearch(value)
                      }}
                      />
                                
                      </div>
                    </div>
                  </div>
                </div>
                <Map
                  restaurants={filteredRestaurants}
                  isFilterUpdated={mapfilters}
                  handleMarkersChange={(restaurants: any) =>
                    handleRestaurantChange(restaurants)
                  }
                />
                {/* Full List */}
                <div
                  className={`expander-section ${styles.resetButton} align-center justify-center bg-black mt-4 p-2`}
                >
                  <div className="flex flex-col px-2">
                    <div className="form-check">
                      <label
                        className="flex algin-center lg:px-8 form-check-label justify-center p-2"
                        onClick={handleCloseClick}
                      >
                        <input
                          className="form-check-input mr-2 hidden"
                          type="checkbox"
                          checked={fullListChecked}
                          onChange={(e) => {
                            updateFilters(e.target.checked, "full-list");
                            setWeeklyParticipatingSelected([]);
                            setCuisinesSelected([]);
                            setCuratedSelected([]);
                            setSearchFilters([]);
                            setSearch('');
                            setCuisineFilters(new Set<string>());
                          }}
                          onClick={handleCloseClick}
                        />
                        <span>reset</span>
                      </label>
                    </div>
                  </div>
                </div>

                {selectedDiningSelections?.length > 0 && (
                  <PageAd
                    adData={
                      selectedDiningSelectionsLast?.node?.categoryAds
                        ?.categoryAd
                    }
                  />
                )}
                <PageSeparator optionalHeadline="search results" />
                {/* Restaurants */}
                <div className="d-flex justify-content-evenly mt-8 ">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-x-8">
                    {selectedLocationsOrCuratedCollections.length > 0 && (
                      <CardAd
                        adData={
                          selectedLocationsOrCuratedCollectionsLast?.node
                            ?.categoryAds?.categoryAd
                        }
                      />
                    )}
                    {filteredRestaurants?.map(({ node: restaurantItem }) => (
                      <div
                        className="flex flex-col justify-end border-b-2 border-gray glisten "
                        key={restaurantItem.id}
                      >
                        <Link
                          href={restaurantItem?.uri}
                          className=" block mt-0 mb-auto"
                          target="_blank"
                        >
                          <div className={`${styles.dining_card} relative`}>
                            <Image
                              className={`${styles.results_image} absolute inset-0 object-cover w-full h-full`}
                              src={
                                restaurantItem?.featuredImage?.node
                                  ?.mediaItemUrl
                              }
                              alt={restaurantItem?.featuredImage?.node?.altText}
                              width={200}
                              height={200}
                            />
                          </div>
                          <div className={`mt-2 ${styles.dining_card_body}`}>
                            {restaurantItem?.locations?.edges?.map(
                              ({ node }, index) => (
                                <span key={node?.id}>
                                  {node?.name}
                                  {restaurantItem?.locations?.edges?.length -
                                    1 !==
                                    index &&
                                  restaurantItem?.locations?.edges?.length > 1
                                    ? ", "
                                    : ""}
                                </span>
                              )
                            )}
                          </div>
                          <h3 className={`mb-1 ${styles.dining_card_headline}`}>
                            {restaurantItem?.title}
                          </h3>
                        </Link>

                        <div
                          className={`${styles.dining_links} my-2 mb-2 flex justify-between`}
                        >
                          {restaurantItem?.restaurantFields.openTable ? (
                            <button
                              className="mr-1 md:mr-2 site-btn site-btn--secondary site-btn--small-on-mobile w-full text-center flex items-center justify-center"
                              onClick={() =>
                                openModal(
                                  `https://www.opentable.com/restref/client/?rid=${restaurantItem?.restaurantFields.openTableLink}&restref=2489&lang=en-US`
                                )
                              }
                            >
                              Find a Table
                            </button>
                          ) : (
                            <a
                              href={restaurantItem?.restaurantFields.website}
                              className="mr-1 md:mr-2 site-btn site-btn--secondary site-btn--small-on-mobile w-full text-center flex items-center justify-center"
                              target="_blank"
                            >
                              Find a Table
                            </a>
                          )}

                          {/* Removed for now */}
                          {false &&
                          restaurantItem?.restaurantFields.openTable ? (
                            <button
                              className="site-btn site-btn--secondary border-gray w-full mb-0 site-btn--small-on-mobile text-center"
                              onClick={() => {
                                handleAddToItinerary(
                                  restaurantItem?.slug,
                                  restaurantItem?.title,
                                  restaurantItem?.restaurantFields.openTableLink
                                );
                                handleAlreadyIn();
                              }}
                            >
                              Add to Itinerary
                            </button>
                          ) : (
                            <Link
                              href={restaurantItem?.uri}
                              className="mr-1 md:mr-2 mr-0 site-btn site-btn--secondary site-btn--small-on-mobile w-full text-center flex items-center justify-center"
                            >
                              View <br />
                              Menu
                            </Link>
                          )}

                          {restaurantItem?.restaurantFields.openTable ? (
                            <button
                              className="site-btn site-btn-- border-gray mb-0 float-right site-btn--small-on-mobile text-center"
                              title="Add to Itinerary"
                              onClick={() => {
                                handleAddToItinerary(
                                  restaurantItem?.slug,
                                  restaurantItem?.title,
                                  restaurantItem?.restaurantFields.openTableLink
                                );
                                handleAlreadyIn();
                              }}
                            >
                              <svg
                                className={`${styles.forkButton}`}
                                version="1.0"
                                xmlns="http://www.w3.org/2000/svg"
                                width="126.000000pt"
                                height="158.000000pt"
                                viewBox="0 0 126.000000 158.000000"
                                preserveAspectRatio="xMidYMid meet"
                              >
                                <g
                                  transform="translate(0.000000,158.000000) scale(0.100000,-0.100000)"
                                  fill="#333"
                                  stroke="none"
                                >
                                  <path
                                    d="M247 1422 c-15 -17 -17 -75 -17 -625 0 -594 0 -607 20 -627 18 -18
                              33 -20 179 -20 136 0 160 2 165 16 3 9 6 94 6 189 l0 173 -35 21 c-52 31 -85
                              106 -85 196 0 137 22 530 31 540 6 5 9 3 9 -6 1 -58 30 -463 34 -466 16 -17
                              24 26 30 174 8 202 17 303 25 303 4 0 12 -106 19 -235 13 -232 17 -265 32
                              -265 9 0 15 57 31 318 7 100 15 182 19 182 8 0 20 -201 20 -349 0 -104 10
                              -146 28 -126 5 6 14 96 21 200 24 374 38 365 47 -30 8 -338 5 -357 -62 -424
                              l-44 -44 0 -178 c0 -98 4 -180 8 -183 15 -9 154 15 211 36 85 31 153 106 183
                              200 22 70 23 87 23 393 0 340 -5 384 -50 475 -28 55 -75 100 -134 130 -77 38
                              -176 49 -447 50 -231 0 -252 -1 -267 -18z"
                                  />
                                </g>
                              </svg>
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Container>
          <PageSeparator optionalHeadline="presented by" />
          <PageAd adData={bottomAd} />
        </Main>
      </Layout>
      {modalOpen && (
        <ReservationModal
          modalSrc={modalSrc}
          closeModal={closeModal}
          iframeClassNames=""
        />
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const topAd = {
    adsFields: {
      link: "https://www.uber.com/us/en/u/uber-one/",
      largeBanner: {
        mediaItemUrl:
          "https://rw-cms.moritz.work/wp-content/uploads/2023/07/Uber_Restaurant-Week-Ads_main-top-1.jpg",
      },
    },
  };
  const bottomAd = {
    adsFields: {
      link: "https://www.uber.com/us/en/u/uber-one/",
      largeBanner: {
        mediaItemUrl:
          "https://rw-cms.moritz.work/wp-content/uploads/2023/07/Uber_Restaurant-Week-Ads_main-bottom-2-1.jpg",
      },
    },
  };
  const restuarantFilterObjs = await getRestaurantFilterObjects(preview);
  return {
    props: { topAd, bottomAd, restuarantFilterObjs, preview },
  };
};
