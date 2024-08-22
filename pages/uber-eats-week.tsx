import Head from "next/head";
import { GetStaticProps } from "next";
import Main from "../components/main";
import Layout from "../components/layout";
import { getUberPageData } from "../lib/api";


import HomeHeroCarousel from "../components/home-hero-carousel";
import PageContent from "../components/page-content";
import RelatedPages from "../components/page-related";
import PageSeparator from "../components/page-separator";
import PageAd from "../components/page-ad";

export default function Index({
  homeData: { content, homepageFields, pageFields, advertisements },
  mainMenu,
  footerMenu,
  socialMenu,
  preview,
}) {
  const { charities, featureSlider } = homepageFields;
  const {  relatedPages } = pageFields;
  const { topAd, midAd, bottomAd } = advertisements;

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
        <PageContent content={content} />
        <PageAd adData={midAd} />
        <RelatedPages relatedPages={relatedPages} />
        <PageSeparator optionalHeadline="presented by" />
        <PageAd adData={bottomAd} />
      </Main>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const uberPageData = await getUberPageData(preview);
  return {
    props: {
      homeData: uberPageData?.nodeByUri,
      mainMenu: uberPageData?.mainMenu?.nodes[0],
      footerMenu: uberPageData?.footerMenu?.nodes[0],
      socialMenu: uberPageData?.socialMenu?.nodes[0],
      preview,
    },
  };
};
