/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { MediaQuery } from "@snappy/browser";
import { Bridge } from "@snappy/platform";
import { Theme as ThemePrefs, type Theme as ThemeValue } from "@snappy/ui-core";

import { $theme } from "../Store";
import { ThemeFog } from "./ThemeFog";
import { ThemeTransition } from "./ThemeTransition";

export type ResolvedTheme = `dark` | `light`;

export type Theme = ThemeValue;

const prefersDarkQuery = `(prefers-color-scheme: dark)` as const;

const effective = (value = $theme()): ResolvedTheme =>
  value === `system` ? (MediaQuery.matches(prefersDarkQuery) ? `dark` : `light`) : value;

const fog = ThemeFog(effective);

const applyEffective = () => {
  const next = effective();
  document.documentElement.dataset[`theme`] = next;
  Bridge.setBarStyle(next === `dark` ? `dark` : `light`);
  fog.sync();
};

const transitionDirection = (next: ResolvedTheme) => (next === `dark` ? `in` : `out`);

const init = () => {
  MediaQuery.subscribe(prefersDarkQuery, applyEffective);
  $theme.subscribe(applyEffective);
  ThemeTransition.init();
  applyEffective();
};

const set = (value: Theme) =>
  ThemeTransition.start({ direction: transitionDirection(effective(value)), onChange: () => $theme.set(value) });

const toggle = () => set(effective() === `dark` ? `light` : `dark`);

export const Theme = {
  effective,
  init,
  key: ThemePrefs.key,
  resolve: ThemePrefs.resolve,
  toggle,
  values: ThemePrefs.values,
};
