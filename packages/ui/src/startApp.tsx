/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { ReactNode } from "react";

import { createRoot } from "react-dom/client";

import "./styles/index.css";
import { Theme } from "./theme/Theme";

const fogId = `fog-bg`;

export const ensureFogContainer = (): void => {
  if (document.querySelector(`#${fogId}`) !== null) {
    return;
  }
  const div = document.createElement(`div`);
  div.id = fogId;
  div.setAttribute(`aria-hidden`, `true`);
  document.body.prepend(div);
};

export const startApp = (container: HTMLElement, app: ReactNode): void => {
  ensureFogContainer();
  Theme.restore();
  createRoot(container).render(app);
};
