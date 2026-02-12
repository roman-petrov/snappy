const STORAGE_KEY = `snappy_theme`;
const THEMES = [`light`, `dark`] as const;

export type Theme = (typeof THEMES)[number];
const DEFAULT: Theme = `light`;
const isTheme = (v: string): v is Theme => THEMES.includes(v as Theme);

const current = (): Theme => {
  const v = document.documentElement.dataset[`theme`] ?? ``;

  return isTheme(v) ? v : DEFAULT;
};

const apply = (theme: Theme): void => {
  document.documentElement.dataset[`theme`] = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    //
  }
};

const toggle = (): void => {
  apply(current() === `dark` ? `light` : `dark`);
};

const restore = (): void => {
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
