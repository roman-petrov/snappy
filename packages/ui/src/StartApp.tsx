/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { ReactNode } from "react";

import { createRoot, hydrateRoot } from "react-dom/client";

import styles from "./StartApp.module.scss";
import "./styles/index.scss";
import { Theme } from "./theme/Theme";

export type StartAppOptions = { disableTextSelection?: boolean; server?: boolean };

export const startApp = (
  selector: string,
  app: ReactNode,
  { disableTextSelection = false, server = false }: StartAppOptions = {},
) => {
  const container = document.querySelector(selector);
  if (!(container instanceof HTMLElement)) {
    return;
  }
  const fogId = `fog-bg`;
  const div = document.createElement(`div`);
  div.id = fogId;
  div.setAttribute(`aria-hidden`, `true`);
  document.body.prepend(div);
  Theme.restore();
  if (disableTextSelection) {
    container.classList.add(styles.disableTextSelection);
  }
  if (server) {
    hydrateRoot(container, app);
  } else {
    createRoot(container).render(app);
  }
};
