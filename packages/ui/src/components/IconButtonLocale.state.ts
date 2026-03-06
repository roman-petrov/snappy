import { useStoreValue } from "@snappy/store";

import { Locale } from "../core";
import { t } from "../locales";
import { $locale } from "../Store";

export const useIconButtonLocaleState = () => ({
  ariaLabel: t(`localeSwitcher`),
  icon: useStoreValue($locale) === `ru` ? `🇷🇺` : `🇺🇸`,
  onClick: () => Locale.toggle(),
});
