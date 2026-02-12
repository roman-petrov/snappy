import { LocaleStore } from "./LocaleStore";

import type { LocaleSwitcherProps } from "./LocaleSwitcher";

export const useLocaleSwitcherState = (props: LocaleSwitcherProps = {}) => {
  const get = props.getLocale ?? LocaleStore.getLocale;
  const set = props.setLocale ?? LocaleStore.setLocale;
  const locale = get();
  const next = locale === `en` ? `ru` : `en`;

  return {
    ariaLabel: locale === `en` ? `Switch to Russian` : `Переключить на английский`,
    label: locale === `en` ? `EN` : `RU`,
    onClick: () => set(next),
  };
};
