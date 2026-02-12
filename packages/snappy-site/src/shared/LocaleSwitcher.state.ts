import type { LocaleSwitcherProps } from "./LocaleSwitcher";

import { t as appT } from "../app/Locale";
import { LocaleStore } from "./LocaleStore";

export const useLocaleSwitcherState = (props: LocaleSwitcherProps = {}) => {
  const get = props.getLocale ?? LocaleStore.getLocale;
  const set = props.setLocale ?? LocaleStore.setLocale;
  const locale = get();
  const next = locale === `en` ? `ru` : `en`;
  const t = props.t ?? appT;

  return { ariaLabel: t(`localeSwitcher`), label: locale === `en` ? `EN` : `RU`, onClick: () => set(next) };
};
