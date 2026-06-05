/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import { Dom } from "@snappy/browser";
import { _ } from "@snappy/core";

const attribute = `data-theme-transition`;
const originX = `--theme-transition-x`;
const originY = `--theme-transition-y`;
let pointer: undefined | { x: number; y: number };

const applyOrigin = (root: HTMLElement) => {
  if (pointer === undefined) {
    return;
  }

  root.style.setProperty(originX, _.px(pointer.x));
  root.style.setProperty(originY, _.px(pointer.y));
};

const clearOrigin = (root: HTMLElement) => {
  root.style.removeProperty(originX);
  root.style.removeProperty(originY);
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
