import { useStoreValue } from "@snappy/store";

import { $locale, Locale, t, Vibrate } from "..";

export const useIconButtonLocaleState = () => ({
  ariaLabel: t(`localeSwitcher`),
  icon: useStoreValue($locale) === `ru` ? `🇷🇺` : `🇺🇸`,
  onClick: () => {
    Vibrate.confirm();
    Locale.toggle();
  },
});
