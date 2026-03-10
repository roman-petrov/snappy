import { $locale, AndroidBridge, Locale, t } from "..";

export const useIconButtonLocaleState = () => ({
  ariaLabel: t(`localeSwitcher`),
  icon: $locale.value === `ru` ? `🇷🇺` : `🇺🇸`,
  onClick: () => {
    AndroidBridge.hapticImpact(`confirm`);
    Locale.toggle();
  },
});
