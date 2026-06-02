import { faviconUrl } from "../assets";
import styles from "./Logo.module.scss";
import { Text } from "./Text";

export type LogoProps = { title?: string };

export const Logo = ({ title }: LogoProps = {}) => (
  <a className={styles.logo} href="/" title={title}>
    <img alt="" className={styles.logoIcon} height={20} src={faviconUrl} width={20} />
    {` `}
    <Text cn={styles.logoText} color="primary" text="Snappy" />
  </a>
);
