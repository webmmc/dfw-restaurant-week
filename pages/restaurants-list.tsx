import React, { useEffect, useRef } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Container from "../components/container";
import PageSeparator from "../components/page-separator";
import PageAd from "../components/page-ad";
import { getRestaurantFilterObjects } from "../lib/api";
import Main from "../components/main";
import Layout from "../components/layout";
import Table from "../components/table";
import Image from "next/image";
import { FiPrinter } from "react-icons/fi";
import ReactToPrint from "react-to-print";
import logo from "../public/favicon/mercedesbenzofplano.png";

export default function RestaurantList({
  topAd,
  bottomAd,
  restuarantFilterObjs: { restaurants, mainMenu, footerMenu, socialMenu },
  preview,
}) {
  const tableRef = useRef(null);

  const restaurantsTHeaders = [
    {
      name: "Logo",
      position: "first",
    },
    {
      name: "Name",
      position: "common",
    },
    {
      name: "Week Participating",
      position: "common",
    },
    {
      name: "Dining Selection",
      position: "common",
    },
  ];

  const getTableBody = () => {
    const currentData = [];
    if (restaurants.edges.length > 0) {
      restaurants.edges.map((restaurant, index) =>
        currentData.push({
          key: index,
          logo: (
            <Image
              src={
                restaurant.node.restaurantFields?.restaurantLogo.mediaItemUrl
              }
              width={150}
              height={110}
              alt=""
            />
          ),
          name: restaurant.node.title,
          weekParticipating: restaurant.node.weeksParticipating.edges?.map(
            (week, index) => {
              return <p key={index}>{week.node.name}</p>;
            }
          ),
          diningSection: restaurant.node.diningSelections.edges?.map(
            (week, index) => {
              return <p key={index}>{week.node.name}</p>;
            }
          ),
        })
      );
    }
    return currentData;
  };

  return (
    <>
      <Layout
        mainMenu={mainMenu?.nodes[0]}
        footerMenu={footerMenu?.nodes[0]}
        socialMenu={socialMenu?.nodes[0]}
        preview={preview}
      >
        <Head>
          <title>{`DFW Restaurants List`}</title>
        </Head>
        <Main>
          <PageAd adData={topAd} />
          <PageSeparator optionalHeadline="Restaurants List" />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* <Image
              src={logo}
              height={180}
              width={180}
              alt="logo"
            /> */}
          </div>

          {/* <p className="text-center font-bold">
            Driven by Mercedes Benz of Plano
          </p> */}
          <div ref={tableRef} className="md:block flex justify-center mx-5">
            <Table
              tableBody={getTableBody()}
              tableHeaders={restaurantsTHeaders}
            />
          </div>
          <PageSeparator optionalHeadline="presented by" />
          <PageAd adData={bottomAd} />
        </Main>
        <ReactToPrint
          trigger={() => (
            <button className="floating-button">
              <FiPrinter />
            </button>
          )}
          content={() => tableRef.current}
        />
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const topAd = {
    adsFields: {
      link: "https://www.ubereats.com/uber-one",
      largeBanner: {
        mediaItemUrl:
          "https://restaurantcms2.wpenginepowered.com/wp-content/uploads/2023/06/2024-DFWRW-UBER-EATS-DFWRW-PORTAL-WEBSITE-AD-5-1230X420.jpg",
      },
    },
  };
  const bottomAd = {
    adsFields: {
      link: "https://www.ubereats.com/uber-one",
      largeBanner: {
        mediaItemUrl:
          "https://restaurantcms2.wpenginepowered.com/wp-content/uploads/2023/06/2024-DFWRW-UBER-MAIN-BOTTOM-1230X420.jpg",
      },
    },
  };
  const restuarantFilterObjs = await getRestaurantFilterObjects(preview);
  return {
    props: { topAd, bottomAd, restuarantFilterObjs, preview },
  };
};
