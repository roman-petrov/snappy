import { $theme, Theme } from "../core";
import { t } from "../locales";

export const useIconButtonThemeState = () => ({
  ariaLabel: t(`themeToggle`),
  icon: $theme.value === `dark` ? `🌙` : `☀️`,
  onClick: Theme.toggle,
});
