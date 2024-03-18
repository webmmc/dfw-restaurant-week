import styles from "./styles/page-sponsors.module.scss";
import Container from "../components/container";
import Image from "next/image";

import { CMS_NAME, CMS_URL } from "../lib/constants";

export default function Sponsors({ passedSponsors }) {
  return (
    <Container>
      <section className={(styles.sponsors || "") + ""}>
        <div
          className={(styles.sponsors__inner || "") + " flex flex-wrap my-6 lg:my-12"}
        >
          {passedSponsors.map((page, index) => (
            <div key={page?.id} className={styles.sponsor}>
              <Image
                src={page?.featuredImage?.node?.mediaItemUrl}
                alt={page?.featuredImage?.node?.altText ?? page?.title ?? ""}
                width={800}
                height={600}
              />
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
