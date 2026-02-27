import { Link, Text } from "@snappy/ui";

import { t } from "../core";
import styles from "./SiteFooter.module.scss";

export const SiteFooter = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <span className={styles.logo}>
        <img alt="" aria-hidden="true" className={styles.logoIcon} height={20} src="/favicon.svg" width={20} />
        {` `}
        <Text as="span" color="accent" text="Snappy" typography="h3" />
      </span>
      <Text as="p" cn={styles.tagline} color="muted" text={t(`footer.tagline`)} typography="largeBody" />
      <Link href="https://t.me/sn4ppy_bot" rel="noopener" target="_blank" text="@sn4ppy_bot" />
    </div>
  </footer>
);
