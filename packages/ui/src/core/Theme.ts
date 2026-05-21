/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { ResolvedTheme as CoreResolvedTheme, Theme as CoreTheme } from "@snappy/ui-core";

import { MediaQuery } from "@snappy/browser";
import { Bridge } from "@snappy/platform";

import { $theme } from "../Store";
import { ThemeFog } from "./ThemeFog";
import { ThemeTransition } from "./ThemeTransition";

export type ResolvedTheme = CoreResolvedTheme;

export type Theme = CoreTheme;

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

export const Theme = { effective, init, toggle };
