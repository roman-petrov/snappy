import type { LocaleKey } from "./LocaleStore";
import { LocaleStore } from "./LocaleStore";
import styles from "./LocaleSwitcher.module.css";

type LocaleSwitcherProps = { getLocale?: () => LocaleKey; setLocale?: (next: LocaleKey) => void };

export const LocaleSwitcher = ({ getLocale, setLocale }: LocaleSwitcherProps = {}) => {
  const get = getLocale ?? LocaleStore.getLocale;
  const set = setLocale ?? LocaleStore.setLocale;
  const locale = get();
  const next = locale === `en` ? `ru` : `en`;
  return (
    <button
      type="button"
      className={styles[`toggle`]}
      onClick={() => set(next)}
      title={locale === `en` ? `Switch to Russian` : `Переключить на английский`}
      aria-label={locale === `en` ? `Switch to Russian` : `Переключить на английский`}
    >
      {locale === `en` ? `EN` : `RU`}
    </button>
  );
};
