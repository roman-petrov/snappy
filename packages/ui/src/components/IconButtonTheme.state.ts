import { $theme, t, Theme, Vibrate } from "..";

export const useIconButtonThemeState = () => ({
  ariaLabel: t(`themeToggle`),
  icon: $theme.value === `dark` ? `🌙` : `☀️`,
  onClick: () => {
    Vibrate.confirm();
    Theme.toggle();
  },
});
