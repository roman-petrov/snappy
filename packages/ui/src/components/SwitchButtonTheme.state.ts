import { useStoreValue } from "@snappy/store";

import { $theme, Theme } from "../core";
import { t } from "../locales";

export const useSwitchButtonThemeState = () => ({
  ariaLabel: t(`themeToggle`),
  label: useStoreValue($theme) === `dark` ? `🌙` : `☀️`,
  onClick: () => Theme.toggle(),
});
