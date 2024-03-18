import Image from "next/image";
import { getRestaurantFilterObjects } from "../../lib/api";
import type { GetStaticProps } from "next";
import Head from "next/head";

const WorkAroundToGetTheDynamicImagesLoadedUsingNextExportOptimizeImages = ({
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
}) => {
  const combinedTaxonomies = [
    ...diningSelections?.edges,
    ...locations?.edges,
    ...curatedCollections?.edges,
  ];

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <h1>
        Work Around To Get The Dynamic Images Loaded Using Next Export Optimize
        Images
      </h1>
      <h2>Combined Taxonomies</h2>
      <ul>
        {combinedTaxonomies?.map(({ node }) => {
          return (
            <li key={node.id}>
              <h3>{node.name}</h3>
              {node?.categoryAds?.categoryAd && (
                <>
                  <Image
                    src={
                      node?.categoryAds?.categoryAd?.adsFields?.largeBanner
                        ?.mediaItemUrl
                    }
                    alt=""
                    width={1920}
                    height={1080}
                  />
                  <Image
                    src={
                      node?.categoryAds?.categoryAd?.adsFields?.largeBanner
                        ?.mediaItemUrl
                    }
                    alt=""
                    width={200}
                    height={200}
                  />
                  <Image
                    src={
                      node?.categoryAds?.categoryAd?.adsFields?.smallBanner
                        ?.mediaItemUrl
                    }
                    alt=""
                    width={1920}
                    height={1080}
                  />
                  <Image
                    src={
                      node?.categoryAds?.categoryAd?.adsFields?.smallBanner
                        ?.mediaItemUrl
                    }
                    alt=""
                    width={200}
                    height={200}
                  />
                </>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default WorkAroundToGetTheDynamicImagesLoadedUsingNextExportOptimizeImages;

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const restuarantFilterObjs = await getRestaurantFilterObjects(preview);
  return {
    props: { restuarantFilterObjs, preview },
  };
};
