import { useRef } from "react";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import Main from "../components/main";
import Layout from "../components/layout";
import PostTitle from "../components/post-title";
import Tags from "../components/tags";
import SimplePageHero from "../components/page-hero-simple";
import PageContent from "../components/page-content";
import Sponsors from "../components/page-sponsors";
import PageSeparator from "../components/page-separator";
import PageAd from "../components/page-ad";
import RelatedPages from "../components/page-related";
import PageGallery from "../components/page-gallery";
import ContactForm from "../components/contact-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import "react-toastify/dist/ReactToastify.css";

import { getAllPagesWithSlug, getPageAndMorePages } from "../lib/api";
import { CMS_NAME } from "../lib/constants";

export default function Post({
  page,
  pages,
  mainMenu,
  footerMenu,
  socialMenu,
  preview,
}) {
  const router = useRouter();

  const { slug } = router.query;

  const showSpecificWord = slug === "contact";
  const contactFormRef = useRef(null);

  const pageData = {
    title: page?.title,
    thumbnail: page?.featuredImage?.node?.mediaItemUrl,
    heroImage: page?.pageFields?.heroImage?.mediaItemUrl,
    heroVideoUrl: page?.pageFields?.heroVideoUrl,
    staffGallery: page?.galleryFields?.staffGallery ?? false,
  };

  if (!router.isFallback && !page?.slug) {
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
        {/* <title>{`${pageData.title} | DFW Restaurant Week`}</title> */}
        <title>{`| DFW Restaurant Week`}</title>
      </Head>

      <Main>
        {router.isFallback ? (
          <div className="absolute inset-0 preloader">Loading…</div>
        ) : (
          <>
            <PageAd adData={page?.advertisements?.topAd} />
            <SimplePageHero pageData={pageData} />
            <PageContent content={page?.content} />
            <div>
              {showSpecificWord && (
                <>
                  <GoogleReCaptchaProvider reCaptchaKey="6Lc2mKUmAAAAAKtN-UO5gWmPi6aF-XsMDLnFzo4k">
                    <ContactForm
                      ref={contactFormRef}
                      onSubmit={async (formData) => {
                        const res = await axios.post(
                          "https://rw-cms.moritz.work/wp-json/contact-form-7/v1/contact-forms/536/feedback",
                          formData,
                          {
                            headers: {
                              "Content-Type": "multipart/form-data",
                            },
                          }
                        );
                        if (
                          res.status === 200 &&
                          res.statusText === "OK" &&
                          res.data.status === "mail_sent"
                        ) {
                          const message =
                            res.data.message || "Message sent successfully";
                          toast.success(message);
                          // reset form
                          contactFormRef.current.resetForm();
                        } else {
                          toast.error("Something went wrong");
                        }
                      }}
                    />
                  </GoogleReCaptchaProvider>
                  <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick={true}
                  />
                </>
              )}
            </div>
            <PageGallery content={pageData?.staffGallery} />
            <PageAd adData={page?.advertisements?.midAd} />
            <RelatedPages relatedPages={page?.pageFields?.relatedPages} />
            {page?.advertisements?.bottomAd ? (
              <PageSeparator optionalHeadline="presented by" />
            ) : null}
            <PageAd adData={page?.advertisements?.bottomAd} />
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
  const data = await getPageAndMorePages(params?.slug, preview, previewData);
  return {
    props: {
      preview,
      page: data.page,
      pages: data.pages,
      mainMenu: data?.mainMenu?.nodes[0],
      footerMenu: data?.footerMenu?.nodes[0],
      socialMenu: data?.socialMenu?.nodes[0],
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPages = await getAllPagesWithSlug();
  return {
    paths: allPages?.edges.map(({ node }) => `/${node.slug}`) || [],
    fallback: false,
  };
};
