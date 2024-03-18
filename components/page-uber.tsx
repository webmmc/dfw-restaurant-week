import styles from "./styles/page-related.module.scss";
import Container from "../components/container";
import Image from "next/image";
import Link from "next/link";

import { CMS_NAME, CMS_URL } from "../lib/constants";

export default function UberEatsLinks({ relatedPages }) {
  if (!relatedPages) {
    return <div></div>;
  }

  console.log( relatedPages.length )

  return (
    <Container>
      <section className={(styles.related || "") + " my-6 lg:my-12"}>
        <div className={(styles.related__inner || "") + " flex flex-wrap " + ((relatedPages.length % 2 === 0) ? 'this--even' : 'this--odd') + ' ' +  ((relatedPages.length % 3 === 0) ? 'this--three' : 'this--other') }>
          {relatedPages.map((item, index) => (
            <Link
              href={`${item?.link}`}
              key={index}
              className={styles.page + " glisten larger-link"}
            >
              <Image
                src={item?.thumbnail?.mediaItemUrl}
                alt={item?.thumbnail?.altText ?? item.title ?? ""}
                width={350}
                height={233.33}
              />
              <h4 className="uppercase my-4">{item?.title}</h4>
              <p>{item?.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
