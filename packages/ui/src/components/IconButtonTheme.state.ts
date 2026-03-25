import { useStoreValue } from "@snappy/store";

import { $theme, t, Theme } from "..";

export const useIconButtonThemeState = () => ({
  ariaLabel: t(`themeToggle`),
  icon: useStoreValue($theme) === `dark` ? `🌙` : `☀️`,
  onClick: Theme.toggle,
});
