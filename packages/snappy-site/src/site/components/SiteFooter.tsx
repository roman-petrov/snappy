import { Link, Text } from "@snappy/ui";

import { t } from "../core";
import styles from "./SiteFooter.module.css";

export const SiteFooter = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <span className={styles.logo}>
        <img alt="" aria-hidden="true" className={styles.logoIcon} height={20} src="/favicon.svg" width={20} />
        {` `}
        <Text as="span" color="accent" variant="h3">
          Snappy
        </Text>
      </span>
      <Text as="p" cn={styles.tagline} color="muted" variant="largeBody">
        {t(`footer.tagline`)}
      </Text>
      <Link href="https://t.me/sn4ppy_bot" rel="noopener" target="_blank">
        @sn4ppy_bot
      </Link>
    </div>
  </footer>
);
