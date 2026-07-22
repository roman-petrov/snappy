/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import { _ } from "@snappy/core";

import { Dom } from "./Dom";
import { ThemeVar } from "./ThemeVar";

const heightVar = `ime-height`;
const insetVar = `ime-inset`;
const safeVar = `stage-safe-bottom`;
const coverBottomLeftRadiusVar = `cover-bottom-left-radius`;

const init = (() => {
  let open = false;

  const sync = () => {
    const viewport = window.visualViewport;
    if (viewport === null) {
      return;
    }

    const height = Math.max(0, window.innerHeight - viewport.height);
    const next = height > 0;
    ThemeVar.write(heightVar, _.px(height));
    ThemeVar.write(insetVar, _.px(Math.max(0, height - viewport.offsetTop)));

    if (next === open) {
      return;
    }

    open = next;

    if (next) {
      ThemeVar.write(safeVar, `0px`);
      ThemeVar.write(coverBottomLeftRadiusVar, `0px`);
    } else {
      ThemeVar.remove(safeVar);
      ThemeVar.remove(coverBottomLeftRadiusVar);
    }
  };

  return () => {
    sync();
    Dom.subscribe(window.visualViewport, `resize`, sync);
    Dom.subscribe(window.visualViewport, `scroll`, sync);
  };
})();

const height = ThemeVar.ref(heightVar);
const inset = ThemeVar.ref(insetVar);
const safe = ThemeVar.ref(safeVar);
const coverBottomLeftRadius = (fallback: string) => `var(--${coverBottomLeftRadiusVar}, ${fallback})`;

export const Keyboard = { coverBottomLeftRadius, height, init, inset, safe };
