import { Bridge } from "@snappy/platform";

import { faviconUrl } from "../assets";
import styles from "./Logo.module.scss";
import { Text } from "./Text";

export type LogoProps = { title?: string };

export const Logo = ({ title }: LogoProps = {}) => {
  const content = (
    <>
      <img alt="" className={styles.logoIcon} src={faviconUrl} />
      <Text cn={styles.logoText} color="primary" text="Snappy" />
    </>
  );

  return Bridge.available ? (
    <span className={styles.logo} title={title}>
      {content}
    </span>
  ) : (
    <a className={styles.logo} href="/" title={title}>
      {content}
    </a>
  );
};
