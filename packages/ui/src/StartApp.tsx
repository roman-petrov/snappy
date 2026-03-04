/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { ReactNode } from "react";

import { createRoot, hydrateRoot } from "react-dom/client";

import "./styles/index.scss";
import { Theme } from "./theme/Theme";

export type StartAppOptions = { readonly server?: boolean };

export const startApp = (container: HTMLElement, app: ReactNode, { server = false }: StartAppOptions = {}) => {
  const fogId = `fog-bg`;
  if (document.querySelector(`#${fogId}`) !== null) {
    return;
  }
  const div = document.createElement(`div`);
  div.id = fogId;
  div.setAttribute(`aria-hidden`, `true`);
  document.body.prepend(div);
  Theme.restore();
  if (server) {
    hydrateRoot(container, app);
  } else {
    createRoot(container).render(app);
  }
};
