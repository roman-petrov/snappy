/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { ResolvedTheme as CoreResolvedTheme, Theme as CoreTheme } from "@snappy/ui-core";

import { Dom, MediaQuery } from "@snappy/browser";
import { Bridge } from "@snappy/platform";

import { $theme } from "../Store";
import { ThemeFog } from "./ThemeFog";
import { ThemeTransition } from "./ThemeTransition";

export type ResolvedTheme = CoreResolvedTheme;

export type Theme = CoreTheme;

const prefersDarkQuery = `(prefers-color-scheme: dark)` as const;
const systemDark = () => (Bridge.available ? Bridge.systemDark() === true : MediaQuery.matches(prefersDarkQuery));
const effective = (value = $theme()): ResolvedTheme => (value === `system` ? (systemDark() ? `dark` : `light`) : value);
const fog = ThemeFog(effective);

const applyEffective = () => {
  const next = effective();
  document.documentElement.dataset[`theme`] = next;
  Bridge.setBarStyle(next === `dark` ? `dark` : `light`);
  fog.sync();
};

const init = () => {
  ThemeTransition.init();
  if (Bridge.available) {
    Dom.subscribe(window, Bridge.systemThemeChangedEvent, applyEffective);
  } else {
    MediaQuery.subscribe(prefersDarkQuery, applyEffective);
  }
  $theme.subscribe(applyEffective);
  applyEffective();
};

const set = (value: Theme) => {
  if (value === $theme()) {
    return;
  }

  ThemeTransition.run(() => $theme.set(value));
};

const toggle = () => set(effective() === `dark` ? `light` : `dark`);

export const Theme = { effective, init, set, toggle };
