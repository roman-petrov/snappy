import { Locale } from "../core";
import { t } from "../locales";
import { $locale } from "../Store";

export const useIconButtonLocaleState = () => ({
  ariaLabel: t(`localeSwitcher`),
  icon: $locale.value === `ru` ? `🇷🇺` : `🇺🇸`,
  onClick: Locale.toggle,
});
