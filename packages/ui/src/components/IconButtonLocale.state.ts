import { useStoreValue } from "@snappy/store";

import { $locale, Locale, t } from "..";

export const useIconButtonLocaleState = () => ({
  ariaLabel: t(`localeSwitcher`),
  icon: useStoreValue($locale) === `ru` ? `🇷🇺` : `🇺🇸`,
  onClick: Locale.toggle,
});
