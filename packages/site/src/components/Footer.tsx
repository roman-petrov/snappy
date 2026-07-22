import { Link, Text } from "@snappy/ui";

import { t } from "../locales";
import styles from "./Footer.module.scss";

export const Footer = () => (
  <footer className={styles.footer}>
    <Text as="p" cn={styles.tagline} text={t(`footer.tagline`)} typography="body" />
    <div className={styles.bottom}>
      <div className={styles.meta}>
        <Text as="p" cn={styles.rights} text={t(`footer.rights`)} typography="caption" />
        <Link link={{ href: `mailto:${t(`footer.email`)}` }} text={t(`footer.email`)} />
      </div>
      <nav className={styles.links}>
        <Link link={{ href: `/privacy` }} muted text={t(`footer.privacy`)} />
        <Link link={{ href: `/terms` }} muted text={t(`footer.terms`)} />
      </nav>
    </div>
  </footer>
);
