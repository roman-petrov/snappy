import type { LocaleKey } from "./LocaleStore";

import { LocaleStore } from "./LocaleStore";
import styles from "./LocaleSwitcher.module.css";

interface LocaleSwitcherProps { getLocale?: () => LocaleKey; setLocale?: (next: LocaleKey) => void }

export const LocaleSwitcher = ({ getLocale, setLocale }: LocaleSwitcherProps = {}) => {
  const get = getLocale ?? LocaleStore.getLocale;
  const set = setLocale ?? LocaleStore.setLocale;
  const locale = get();
  const next = locale === `en` ? `ru` : `en`;

  return (
    <button
      aria-label={locale === `en` ? `Switch to Russian` : `Переключить на английский`}
      className={styles[`toggle`]}
      onClick={() => { set(next); }}
      title={locale === `en` ? `Switch to Russian` : `Переключить на английский`}
      type="button"
    >
      {locale === `en` ? `EN` : `RU`}
    </button>
  );
};
