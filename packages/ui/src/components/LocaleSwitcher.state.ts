import type { LocaleSwitcherProps } from "./LocaleSwitcher";

import { LocaleStore } from "../LocaleStore";

const defaultT = (key: string) => key;

export const useLocaleSwitcherState = ({ getLocale, setLocale, t: tProp }: LocaleSwitcherProps = {}) => {
  const get = getLocale ?? LocaleStore.getLocale;
  const set = setLocale ?? LocaleStore.setLocale;
  const locale = get();
  const next = locale === `en` ? `ru` : `en`;
  const t = tProp ?? defaultT;

  return { ariaLabel: t(`localeSwitcher`), label: locale === `en` ? `EN` : `RU`, onClick: () => set(next) };
};
