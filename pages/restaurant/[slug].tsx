import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import Main from "../../components/main";
import Layout from "../../components/layout";
import PostTitle from "../../components/post-title";
import Tags from "../../components/tags";
import PageHero from "../../components/page-hero";
import PageContent from "../../components/page-content";
import Sponsors from "../../components/page-sponsors";
import PageSeparator from "../../components/page-separator";
import PageAd from "../../components/page-ad";
import RestaurantMeta from "../../components/restaurant-meta";
import {
  getAllRestaurantsWithSlug,
  getRestaurantAndMoreRestaurants,
} from "../../lib/api";
import { CMS_NAME } from "../../lib/constants";

export default function Post({
  restaurant,
  restaurants,
  mainMenu,
  footerMenu,
  socialMenu,
  preview,
}) {
  const router = useRouter();

  const regionsArray = restaurant?.locations.edges.map(({ node }) => {
    return node?.name;
  });

  const cuisineArray = restaurant?.cuisines.edges.map(({ node }) => {
    return node?.name;
  });

  const selectionsArray = restaurant?.diningSelections.edges.map(({ node }) => {
    return node?.name;
  });

  const weeksArray = restaurant?.weeksParticipating.edges.map(({ node }) => {
    return node?.name;
  });

  const restaurantData = {
    slug: restaurant?.slug,
    title: restaurant?.title,
    excerpt: restaurant?.restaurantFields.shortSummary,
    thumbnail: restaurant?.featuredImage?.node?.mediaItemUrl,
    logo: restaurant?.restaurantFields?.restaurantLogo?.mediaItemUrl,
    region: regionsArray.join(", "),
    address: restaurant?.restaurantFields?.restaurantAddress,
    website: restaurant?.restaurantFields?.website,
    phone: restaurant?.restaurantFields?.phone,
    cuisine: cuisineArray,
    selection: selectionsArray,
    weeks: weeksArray,
    menu: restaurant?.restaurantFields?.menu?.mediaItemUrl,
    openTable: restaurant?.restaurantFields?.openTable,
    openTableLink: restaurant?.restaurantFields?.openTableLink,
  };

  if (!router.isFallback && !restaurant?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout
      mainMenu={mainMenu}
      footerMenu={footerMenu}
      socialMenu={socialMenu}
      preview={preview}
    >
      <Head>
        <title>{`${restaurant.title} | DFW Restaurant Week`}</title>
      </Head>

      <Main>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <PageAd adData={restaurant?.advertisements?.topAd} />
            <PageHero restaurantData={restaurantData} />
            <PageContent content={restaurant?.content} />
            <RestaurantMeta restaurantData={restaurantData} metaType="weeks" />
            <RestaurantMeta restaurantData={restaurantData} metaType="menu" />
            <PageAd adData={restaurant?.advertisements?.midAd} />
            <RestaurantMeta restaurantData={restaurantData} metaType="map" />
            {restaurant?.advertisements?.bottomAd ? (
              <PageSeparator optionalHeadline="presented by" />
            ) : null}
            <PageAd adData={restaurant?.advertisements?.bottomAd} />
            {/* <Sponsors passedSponsors={DummySponsors} /> */}
          </>
        )}
      </Main>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const data = await getRestaurantAndMoreRestaurants(
    params?.slug,
    preview,
    previewData
  );
  // Check if advertisements are present, otherwise set fallback values.
  if (!data.restaurant?.advertisements?.topAd) {
    data.restaurant.advertisements.topAd = {
      adsFields: {
        link: "https://www.ubereats.com/uber-one",
        largeBanner: {
          mediaItemUrl:
            "https://restaurantcms2.wpenginepowered.com/wp-content/uploads/2023/06/2024-DFWRW-UBER-EATS-DFWRW-PORTAL-WEBSITE-AD-5-1230X420.jpg",
        },
      },
    };
  }
  if (!data.restaurant?.advertisements?.midAd) {
    data.restaurant.advertisements.midAd = {
      adsFields: {
        link: "https://www.dallassymphony.org/ticket-packages/?utm_source=Audacy&utm_medium=DFWRW&utm_campaign=CYO",
        largeBanner: {
          mediaItemUrl:
            "https://restaurantcms2.wpenginepowered.com/wp-content/uploads/2024/08/DSO-RW-CYO-Ads.jpg",
        },
      },
    };
  }
  if (!data.restaurant?.advertisements?.bottomAd) {
    data.restaurant.advertisements.bottomAd = {
      adsFields: {
        link: "https://www.ubereats.com/uber-one",
        largeBanner: {
          mediaItemUrl:
            "https://restaurantcms2.wpenginepowered.com/wp-content/uploads/2023/06/2024-DFWRW-UBER-MAIN-BOTTOM-1230X420.jpg",
        },
      },
    };
  }

  return {
    props: {
      preview,
      restaurant: data.restaurant,
      restaurants: data.restaurants,
      mainMenu: data?.mainMenu?.nodes[0],
      footerMenu: data?.footerMenu?.nodes[0],
      socialMenu: data?.socialMenu?.nodes[0],
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allRestaurants = await getAllRestaurantsWithSlug();
  return {
    paths:
      allRestaurants?.edges.map(({ node }) => `/restaurant/${node.slug}`) || [],
    fallback: false,
  };
};
