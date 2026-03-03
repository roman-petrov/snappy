import type { LocaleSwitcherProps } from "./LocaleSwitcher";

import { LocaleStore } from "../LocaleStore";

const defaultT = (key: string) => key;

export const useLocaleSwitcherState = (props: LocaleSwitcherProps = {}) => {
  const get = props.getLocale ?? LocaleStore.getLocale;
  const set = props.setLocale ?? LocaleStore.setLocale;
  const locale = get();
  const next = locale === `en` ? `ru` : `en`;
  const t = props.t ?? defaultT;

  return { ariaLabel: t(`localeSwitcher`), label: locale === `en` ? `EN` : `RU`, onClick: () => set(next) };
};
