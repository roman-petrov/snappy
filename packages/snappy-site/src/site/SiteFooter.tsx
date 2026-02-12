import { t } from "./Locale";
import styles from "./SiteFooter.module.css";

export const SiteFooter = () => (
  <footer className={styles[`footer`]}>
    <div className={styles[`inner`]}>
      <span className={styles[`logo`]}>
        <img src="/favicon.svg" alt="" className={styles[`logoIcon`]} width={20} height={20} aria-hidden="true" /> Snappy
      </span>
      <p>{t(`footer.tagline`)}</p>
      <a href="https://t.me/sn4ppy_bot" target="_blank" rel="noopener">
        @sn4ppy_bot
      </a>
    </div>
  </footer>
);
