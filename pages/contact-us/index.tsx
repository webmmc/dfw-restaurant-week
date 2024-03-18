import { useRef } from "react";

import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
/* import Image from "next/image";
import Link from "next/link"; */
import ContactForm from "../../components/contact-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { getMenuData } from "../../lib/api";

export default function ContactUs({ preview }) {
  const router = useRouter();
  const contactFormRef = useRef(null);

  return (
    <>
      <Head>
        <title>Contact Us</title>
      </Head>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold">Contact Us</h1>
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
              const message = res.data.message || "Message sent successfully";
              toast.success(message);
              // reset form
              contactFormRef.current.resetForm();
            } else {
              const status = res.data.status || "error";
              const message = res.data.message || "Something went wrong";
              toast.error(status + ": " + message);
              console.error("res", res);
            }
          }}
        />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
        />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  // const menuData = await getMenuData();
  return {
    props: {
      // mainMenu: menuData?.mainMenu?.nodes[0],
      // footerMenu: menuData?.footerMenu?.nodes[0],
      // socialMenu: menuData?.socialMenu?.nodes[0],
      preview,
    },
  };
};
