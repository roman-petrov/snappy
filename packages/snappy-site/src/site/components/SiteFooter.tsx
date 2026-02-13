import { Link } from "@snappy/ui";

import { t } from "../core/Locale";
import styles from "./SiteFooter.module.css";

export const SiteFooter = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <span className={styles.logo}>
        <img alt="" aria-hidden="true" className={styles.logoIcon} height={20} src="/favicon.svg" width={20} />
        {` `}
        Snappy
      </span>
      <p>{t(`footer.tagline`)}</p>
      <Link href="https://t.me/sn4ppy_bot" rel="noopener" target="_blank">
        @sn4ppy_bot
      </Link>
    </div>
  </footer>
);
