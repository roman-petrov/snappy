/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { MediaQuery } from "@snappy/browser";

import { $theme } from "../Store";
import { AndroidBridge } from "./AndroidBridge";
import { ThemeFog } from "./ThemeFog";
import { ThemeTransition } from "./ThemeTransition";

const prefersDarkQuery = `(prefers-color-scheme: dark)` as const;
const themes = [`dark`, `light`, `system`] as const;
const key = `snappy-theme`;

export type ResolvedTheme = `dark` | `light`;

export type Theme = (typeof themes)[number];

const effective = (value = $theme()): ResolvedTheme =>
  value === `system` ? (MediaQuery.matches(prefersDarkQuery) ? `dark` : `light`) : value;

const fog = ThemeFog(effective);

const resolve = (value: Theme | undefined) =>
  value === `dark` || value === `light` || value === `system` ? value : undefined;

const applyEffective = () => {
  const next = effective();
  document.documentElement.dataset[`theme`] = next;
  AndroidBridge.setBarStyle(next === `dark` ? `dark` : `light`);
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

export const Theme = { effective, init, key, resolve, toggle, values: themes };
