import type { Fog as FogInstance } from "./Fog";

import { Fog } from "./Fog";

const STORAGE_KEY = `snappy_theme`;
const THEMES = [`light`, `dark`] as const;
const FOG_OPTIONS = { blurFactor: 0.5, speed: 2, zoom: 2 };

export type Theme = (typeof THEMES)[number];
const DEFAULT: Theme = `light`;
const isTheme = (v: string): v is Theme => THEMES.includes(v as Theme);

const current = (): Theme => {
  const v = document.documentElement.dataset[`theme`] ?? ``;

  return isTheme(v) ? v : DEFAULT;
};

let afterChange: (() => void) | undefined;
const fogRef: { current: FogInstance | undefined } = { current: undefined };

const syncFog = (): void => {
  if (fogRef.current !== undefined) {
    fogRef.current.stop();
    fogRef.current = undefined;
  }
  if (document.documentElement.dataset[`theme`] === `light`) {return;}
  const element = document.querySelector(`#fog-bg`);
  if (element instanceof HTMLElement) {
    fogRef.current = Fog(element, FOG_OPTIONS);
    fogRef.current.start();
  }
};

const apply = (theme: Theme): void => {
  document.documentElement.dataset[`theme`] = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    //
  }
  afterChange?.();
};

const toggle = (): void => {
  apply(current() === `dark` ? `light` : `dark`);
};

const restore = (): void => {
  if (document.querySelector(`#fog-bg`) instanceof HTMLElement) {
    afterChange = () => requestAnimationFrame(syncFog);
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isTheme(saved ?? ``)) {
      apply(saved as Theme);

      return;
    }
  } catch {
    //
  }
  apply(DEFAULT);
};

const onLogoClick = (after?: () => void) => (e: { preventDefault: () => void }) => {
  e.preventDefault();
  toggle();
  after?.();
};

export const Theme = { apply, onLogoClick, restore, toggle };
