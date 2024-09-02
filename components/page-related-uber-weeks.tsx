import React, { useState } from "react";
import styles from "./styles/page-related.module.scss";
import Container from "../components/container";
import Image from "next/image";
import Link from "next/link";

const SUMMARY_CHAR_LIMIT = 150;

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
            const description = page?.description || "";
            const displayText = isExpanded ? description : description;
            return (
              <div key={page?.thumbnail?.id} className={styles.page + " glisten larger-link"}>
                <Link href={page?.link}>
                  <Image
                    src={page?.thumbnail?.mediaItemUrl}
                    alt={page?.thumbnail?.altText ?? page.title ?? ""}
                    width={350}
                    height={233.33}
                  />
                  <h4 className={`${styles.truncate} uppercase my-4`}>{page?.title}</h4>
                </Link>
                <p>{displayText}</p>
                {/* {description.length > SUMMARY_CHAR_LIMIT && (
                  <button onClick={() => toggleSummary(index)}>
                    {isExpanded ? "Read less" : "Read more"}
                  </button>
                )} */}
              </div>
            );
          })}
        </div>
      </section>
    </Container>
  );
}