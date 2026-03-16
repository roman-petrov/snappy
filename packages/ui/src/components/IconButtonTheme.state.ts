import { useStoreValue } from "@snappy/store";

import { $theme, t, Theme, Vibrate } from "..";

export const useIconButtonThemeState = () => ({
  ariaLabel: t(`themeToggle`),
  icon: useStoreValue($theme) === `dark` ? `🌙` : `☀️`,
  onClick: () => {
    Vibrate.confirm();
    Theme.toggle();
  },
});
