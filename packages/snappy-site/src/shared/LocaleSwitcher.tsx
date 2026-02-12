import type { LocaleKey } from "./LocaleStore";

import { useLocaleSwitcherState } from "./LocaleSwitcher.state";
import { LocaleSwitcherView } from "./LocaleSwitcher.view";

export type LocaleSwitcherProps = {
  getLocale?: () => LocaleKey;
  setLocale?: (next: LocaleKey) => void;
  t?: (key: string) => string;
};

export const LocaleSwitcher = (props: LocaleSwitcherProps = {}) => (
  <LocaleSwitcherView {...useLocaleSwitcherState(props)} />
);
