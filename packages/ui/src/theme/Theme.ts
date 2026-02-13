import { Fog } from "./Fog";

const storageKey = `snappy_theme`;
const themes = [`light`, `dark`] as const;
const fogOptions = { blurFactor: 0.5, speed: 2, zoom: 2 };

export type Theme = (typeof themes)[number];
const defaultTheme: Theme = `light`;
const isTheme = (v: string): v is Theme => themes.includes(v as Theme);

const current = (): Theme => {
  const v = document.documentElement.dataset[`theme`] ?? ``;

  return isTheme(v) ? v : defaultTheme;
};

let afterChange: (() => void) | undefined;
const fogRef: { current: Fog | undefined } = { current: undefined };

const syncFog = (): void => {
  if (fogRef.current !== undefined) {
    fogRef.current.stop();
    fogRef.current = undefined;
  }
  if (document.documentElement.dataset[`theme`] === `light`) {
    return;
  }
  const element = document.querySelector(`#fog-bg`);
  if (element instanceof HTMLElement) {
    fogRef.current = Fog(element, fogOptions);
    fogRef.current.start();
  }
};

const apply = (theme: Theme): void => {
  document.documentElement.dataset[`theme`] = theme;
  try {
    localStorage.setItem(storageKey, theme);
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
    const saved = localStorage.getItem(storageKey);
    if (isTheme(saved ?? ``)) {
      apply(saved as Theme);

      return;
    }
  } catch {
    //
  }
  apply(defaultTheme);
};

const onLogoClick = (after?: () => void) => (e: { preventDefault: () => void }) => {
  e.preventDefault();
  toggle();
  after?.();
};

export const Theme = { apply, onLogoClick, restore, toggle };
