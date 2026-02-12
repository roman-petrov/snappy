import { getLocale, setLocale } from "./LocaleStore";
import styles from "./LocaleSwitcher.module.css";

export const LocaleSwitcher = () => {
  const locale = getLocale();
  const next = locale === `en` ? `ru` : `en`;
  return (
    <button
      type="button"
      className={styles[`toggle`]}
      onClick={() => setLocale(next)}
      title={locale === `en` ? `Switch to Russian` : `Переключить на английский`}
      aria-label={locale === `en` ? `Switch to Russian` : `Переключить на английский`}
    >
      {locale === `en` ? `EN` : `RU`}
    </button>
  );
};
