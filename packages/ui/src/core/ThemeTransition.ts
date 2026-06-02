/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
export type StartThemeTransitionArgs = { direction: ThemeTransitionDirection; onChange: () => void };

export type ThemeTransitionDirection = `in` | `out`;

const start = ({ direction, onChange }: StartThemeTransitionArgs) => {
  document.documentElement.dataset[`themeTransitionDir`] = direction;
  void document.startViewTransition(onChange).finished.finally(() => {
    document.documentElement.removeAttribute(`data-theme-transition-dir`);
  });
};

export const ThemeTransition = { start };
