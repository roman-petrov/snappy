/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { Dom } from "@snappy/browser";

export type StartThemeTransitionArgs = { direction: ThemeTransitionDirection; onChange: () => void };

export type ThemeTransitionDirection = `in` | `out`;

export type ThemeTransitionPoint = { x: number; y: number };

const state = { initialized: false, point: undefined as ThemeTransitionPoint | undefined };

const init = () => {
  if (state.initialized) {
    return;
  }

  state.initialized = true;
  Dom.subscribe(document, `pointerdown`, ({ clientX, clientY }) => (state.point = { x: clientX, y: clientY }), {
    passive: true,
  });
};

const start = ({ direction, onChange }: StartThemeTransitionArgs) => {
  const origin = state.point ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const root = document.documentElement;
  root.style.setProperty(`--theme-transition-x`, `${origin.x}px`);
  root.style.setProperty(`--theme-transition-y`, `${origin.y}px`);
  root.style.setProperty(
    `--theme-transition-radius`,
    `${Math.max(
      Math.hypot(origin.x, origin.y),
      Math.hypot(window.innerWidth - origin.x, origin.y),
      Math.hypot(origin.x, window.innerHeight - origin.y),
      Math.hypot(window.innerWidth - origin.x, window.innerHeight - origin.y),
    )}px`,
  );
  root.dataset[`themeTransitionDir`] = direction;
  void document.startViewTransition(onChange).finished.finally(() => {
    document.documentElement.removeAttribute(`data-theme-transition-dir`);
  });
};

export const ThemeTransition = { init, start };
