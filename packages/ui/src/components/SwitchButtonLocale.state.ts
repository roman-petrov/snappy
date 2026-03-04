import { useStoreValue } from "@snappy/store";

import { $locale, Locale } from "../core";
import { t } from "../locales";

export const useSwitchButtonLocaleState = () => ({
  ariaLabel: t(`localeSwitcher`),
  label: useStoreValue($locale) === `en` ? `EN` : `RU`,
  onClick: () => Locale.toggle(),
});
