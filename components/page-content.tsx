import Container from "../components/container";
import parse from "html-react-parser";

export default function PageContent({ content }) {
  return (
    <Container>
      <section className="content my-6">
        <div className="content__inner">{parse(content ?? "")}</div>
      </section>
    </Container>
  );
}
