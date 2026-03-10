import { $theme, AndroidBridge, t, Theme } from "..";

export const useIconButtonThemeState = () => ({
  ariaLabel: t(`themeToggle`),
  icon: $theme.value === `dark` ? `🌙` : `☀️`,
  onClick: () => {
    AndroidBridge.hapticImpact(`confirm`);
    Theme.toggle();
  },
});
