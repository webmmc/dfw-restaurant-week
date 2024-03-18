import styles from './styles/page-separator.module.scss';
import sponsorStyles from './styles/page-sponsors.module.scss';
import Container from "../components/container";

export default function PageSeparator( {optionalHeadline} ){
  return (
    <Container>
        <div className={(sponsorStyles.head || "") + " mt-12"}>
          <div className={(sponsorStyles.line || "") + " background-gray"}></div>
          <h2
            className={(sponsorStyles.heading || "") + " color-gray text-center px-4"}
          >
            {(optionalHeadline ? optionalHeadline : '')}
          </h2>
        </div>
    </Container>
  );
}
