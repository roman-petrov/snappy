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
      <Link link={{ href: `https://t.me/sn4ppy_bot`, rel: `noopener`, target: `_blank` }} text="@sn4ppy_bot" />
    </div>
  </footer>
);
