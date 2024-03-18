import styles from "./styles/page-related.module.scss";
import Container from "../components/container";
import Image from "next/image";
import Link from "next/link";

import { CMS_NAME, CMS_URL } from "../lib/constants";

export default function RelatedPages({ relatedPages }) {
  if (!relatedPages) {
    return <div></div>;
  }
  return (
    <Container>
      <section className={(styles.related || "") + " my-6 lg:my-12"}>
        <div className={(styles.related__inner || "") + " flex flex-wrap"}>
          {relatedPages.map((page, index) => (
            <Link
              href={`/${page?.slug}`}
              key={page?.id}
              className={styles.page + " glisten larger-link"}
            >
              <Image
                src={page?.featuredImage?.node?.mediaItemUrl}
                alt={page?.featuredImage?.node?.altText ?? page.title ?? ""}
                width={350}
                height={233.33}
              />
              <h4 className="uppercase my-4">{page?.title}</h4>
              <p>{page?.pageFields?.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
