import Head from "next/head";
import { GetStaticProps } from "next";
import Main from "../components/main";
import Layout from "../components/layout";
import { getHomePageData } from "../lib/api";

import HomeHeroCarousel from "../components/home-hero-carousel";
import PageContent from "../components/page-content";
import RelatedPages from "../components/page-related";
import Sponsors from "../components/page-sponsors";
import PageSeparator from "../components/page-separator";
import PageAd from "../components/page-ad";

export default function Index({
  homeData: { title, id, content, homepageFields, pageFields, advertisements },
  mainMenu,
  footerMenu,
  socialMenu,
  preview,
}) {
  const { charities, homepageCarousel, sponsors, featureSlider } =
    homepageFields;
  const { summary, relatedPages } = pageFields;
  const { topAd, midAd, bottomAd } = advertisements;

  let featuredRestaurants;
  if(homepageCarousel){
    featuredRestaurants = homepageCarousel.map((restaurant) => {
      return {
        title: restaurant.title,
        id: restaurant.id,
        slug: restaurant.slug,
        contentType: restaurant.contentTypeName,
        locations: restaurant.locations?.edges.map((location) => {
          return location?.node?.name;
        }),
        link: `${restaurant.contentTypeName}/${restaurant.slug}`,
        excerpt: restaurant?.restaurantFields?.shortSummary,
        thumbnail: restaurant?.featuredImage?.node?.mediaItemUrl,
        thumbnailAlt: restaurant?.featuredImage?.node?.altText,
      };
    });
  }

  return (
    <Layout
      mainMenu={mainMenu}
      footerMenu={footerMenu}
      socialMenu={socialMenu}
      preview={preview}
    >
      <Head>
        <title>{`DFW Restaurant Week`}</title>
      </Head>
      <Main>
        <PageAd adData={topAd} />
        <HomeHeroCarousel
          sliderData={featureSlider}
          featuredCharities={charities}
        />
        {/* <PageContent content={content} /> */}
        <PageSeparator optionalHeadline="featuring" />
        <PageAd adData={midAd} />
        <RelatedPages relatedPages={relatedPages} />
        <PageSeparator optionalHeadline="presented by" />
        <PageAd adData={bottomAd} />
        {/* <Sponsors passedSponsors={sponsors} /> */}
      </Main>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const homeData = await getHomePageData(preview);
  return {
    props: {
      homeData: homeData?.nodeByUri,
      mainMenu: homeData?.mainMenu?.nodes[0],
      footerMenu: homeData?.footerMenu?.nodes[0],
      socialMenu: homeData?.socialMenu?.nodes[0],
      preview,
    },
  };
};
