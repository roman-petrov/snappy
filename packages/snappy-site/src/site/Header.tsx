import { LocaleSwitcher } from "../shared/LocaleSwitcher";
import { Theme } from "../Theme";
import { SiteLocale, t } from "./Locale";
import styles from "./Header.module.css";

type Props = { onThemeToggle?: () => void };

export const SiteHeader = ({ onThemeToggle }: Props = {}) => (
  <header className={styles[`header`]}>
    <div className={styles[`inner`]}>
      <a href="/" className={styles[`logo`]} title={t(`themeToggle`)} onClick={Theme.onLogoClick(onThemeToggle)}>
        <img src="/favicon.svg" alt="" className={styles[`logoIcon`]} width={20} height={20} aria-hidden="true" /> Snappy
      </a>
      <nav className={styles[`nav`]}>
        <a href="#features">{t(`nav.features`)}</a>
        <a href="#examples">{t(`nav.examples`)}</a>
        <a href="#who">{t(`nav.who`)}</a>
        <a href="#faq">{t(`nav.faq`)}</a>
        <a href="#start">{t(`nav.start`)}</a>
        <a href="/app">{t(`nav.cabinet`)}</a>
        <LocaleSwitcher getLocale={SiteLocale.getSiteLocale} setLocale={SiteLocale.setSiteLocale} />
      </nav>
    </div>
  </header>
);
