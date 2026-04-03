import { Link, Logo, Text } from "@snappy/ui";

import { t } from "../core";
import styles from "./SiteFooter.module.scss";

export const SiteFooter = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <span className={styles.logo}>
        <Logo />
      </span>
      <Text as="p" cn={styles.tagline} color="muted" text={t(`footer.tagline`)} typography="large" />
      <div className={styles.links}>
        <Link link={{ href: `/app` }} text={t(`footer.appLink`)} />
        <Link link={{ href: `/downloads/snappy-client.exe` }} text={t(`footer.clientDownload`)} />
      </div>
    </div>
  </footer>
);
