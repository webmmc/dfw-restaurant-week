import React, { useState } from "react";
import styles from "./styles/page-related.module.scss";
import Container from "../components/container";
import Image from "next/image";
import Link from "next/link";

import { CMS_NAME, CMS_URL } from "../lib/constants";

const SUMMARY_CHAR_LIMIT = 100; // Adjust as needed for your line length

const truncateText = (text, limit) => {
  if (text.length <= limit) return text;
  return text.substring(0, limit) + "...";
};

export default function RelatedPages({ relatedPages }) {
  const [expandedSummaries, setExpandedSummaries] = useState({});

  const toggleSummary = (index) => {
    setExpandedSummaries((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!relatedPages) {
    return <div></div>;
  }

  return (
    <Container>
      <section className={(styles.related || "") + " my-6 lg:my-12"}>
        <div className={(styles.related__inner || "") + " flex flex-wrap"}>
          {relatedPages.map((page, index) => {
            const isExpanded = expandedSummaries[index];
            const summary = page?.pageFields?.summary || "";
            const displayText = isExpanded ? summary : truncateText(summary, SUMMARY_CHAR_LIMIT);
            return (
              <div key={page?.id} className={styles.page + " glisten larger-link"}>
                <Link href={page.pageFields.externalUrl ?? `/${page?.slug}`} target={page.pageFields.externalUrl ? "_blank" : "_self"}>
                  <Image
                    src={page?.featuredImage?.node?.mediaItemUrl}
                    alt={page?.featuredImage?.node?.altText ?? page.title ?? ""}
                    width={350}
                    height={233.33}
                  />
                  <h4 className={`${styles.truncate} uppercase my-4`}>{page?.title}</h4>
                </Link>
                <p>{displayText}</p>
                {summary.length > SUMMARY_CHAR_LIMIT && (
                  <button onClick={() => toggleSummary(index)}>
                    {isExpanded ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </Container>
  );
}
