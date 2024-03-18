import styles from './styles/main.module.scss';
import Container from "../components/container";

export default function Main({ children }) {
  return <main id="main" className={(styles.content) + ''}>{children}</main>
}
