import styles from "./styles/footer.module.scss";
import Container from "./container";
import Link from "next/link";

export default function Footer({ footerMenu }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={` ${styles.footer || ""} mt-20`}>
      <Container>
        <div className={"py-6 lg:py-10 text-center"}>
          <div
            className={"flex flex-row flex-wrap items-center justify-center"}
          >
            {footerMenu?.menuItems.nodes.map((item, index) => (
              <Link
                key={item.id}
                href={item.url}
                className={`py-2 px-4 ${styles.link} ${
                  index === 0 ? styles.first : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="copyright">
            &copy; {currentYear}. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
}
