import { $locale, Locale, t, Vibrate } from "..";

export const useIconButtonLocaleState = () => ({
  ariaLabel: t(`localeSwitcher`),
  icon: $locale.value === `ru` ? `🇷🇺` : `🇺🇸`,
  onClick: () => {
    Vibrate.confirm();
    Locale.toggle();
  },
});
