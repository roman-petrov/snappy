import { Link, Text } from "@snappy/ui";

import { t } from "../locales";
import styles from "./Footer.module.scss";

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.top}>
      <Text cn={styles.tagline} text={t(`footer.tagline`)} typography="body" />
      <nav className={styles.nav}>
        {([`how`, `can`, `tasks`, `who`, `compare`] as const).map(key => (
          <Link key={key} link={`#${key}`} muted text={t(`nav.${key}`)} />
        ))}
        <Link link={{ href: `/app` }} muted text={t(`footer.app`)} />
        <Link link={{ href: `/download/snappy.apk` }} muted text={t(`footer.android`)} />
      </nav>
    </div>
    <Text cn={styles.rights} text={t(`footer.rights`)} typography="caption" />
  </footer>
);
