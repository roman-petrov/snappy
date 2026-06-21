/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import { Dom } from "@snappy/browser";
import { _ } from "@snappy/core";
import { ThemeVar } from "@snappy/hooks";

const attribute = `data-theme-transition`;
let pointer: undefined | { x: number; y: number };

const applyOrigin = (root: HTMLElement) => {
  if (pointer === undefined) {
    return;
  }

  ThemeVar.write(`theme-transition-x`, _.px(pointer.x), root);
  ThemeVar.write(`theme-transition-y`, _.px(pointer.y), root);
};

const clearOrigin = (root: HTMLElement) => {
  ThemeVar.remove(`theme-transition-x`, root);
  ThemeVar.remove(`theme-transition-y`, root);
};

const init = () => {
  Dom.subscribe(document, `pointerdown`, ({ clientX, clientY }) => {
    pointer = { x: clientX, y: clientY };
  });
};

const run = (update: () => void) => {
  const root = document.documentElement;
  applyOrigin(root);
  root.setAttribute(attribute, `true`);
  void document.startViewTransition(update).finished.finally(() => {
    root.removeAttribute(attribute);
    clearOrigin(root);
  });
};

export const ThemeTransition = { init, run };
