import { Link, Text } from "@snappy/ui";

import { t } from "../locales";
import styles from "./Footer.module.scss";

export const Footer = () => (
  <footer className={styles.footer}>
    <Text as="p" cn={styles.tagline} text={t(`footer.tagline`)} typography="body" />
    <Text as="p" cn={styles.rights} text={t(`footer.rights`)} typography="caption" />
    <nav className={styles.links}>
      <Link link={{ href: `/privacy` }} muted text={t(`footer.privacy`)} />
      <Link link={{ href: `/terms` }} muted text={t(`footer.terms`)} />
    </nav>
  </footer>
);
