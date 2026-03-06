import { useStoreValue } from "@snappy/store";

import { $theme, Theme } from "../core";
import { t } from "../locales";

export const useIconButtonThemeState = () => ({
  ariaLabel: t(`themeToggle`),
  icon: useStoreValue($theme) === `dark` ? `🌙` : `☀️`,
  onClick: () => Theme.toggle(),
});
