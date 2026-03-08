/* eslint-disable init-declarations */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import type { ReactNode } from "react";

import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { Router } from "wouter";

import { App } from "./App";
import { $serverMode, Locale, Theme } from "./core";
import "./styles/index.scss";

const aroundNav = (
  navigate: (to: string, options?: { replace?: boolean }) => void,
  to: string,
  options?: { replace?: boolean },
) => {
  document.startViewTransition(() => navigate(to, options));
};

export type StartAppOptions = {
  base?: string;
  disableTextSelection?: boolean;
  locale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
  server?: boolean;
  theme?: Theme;
};

let remount: (() => void) | undefined;
let remountOnLocaleChange = false;

export const startApp = (
  selector: string,
  app: ReactNode,
  { base, disableTextSelection = false, locale, onLocaleChange, server = false, theme }: StartAppOptions = {},
) => {
  $serverMode.set(server);
  const hasTheme = theme !== undefined;
  const hasLocaleOptions = locale !== undefined || onLocaleChange !== undefined;
  remountOnLocaleChange = onLocaleChange === undefined;
  Theme.init(hasTheme ? { theme } : undefined);
  Locale.init({
    ...(hasLocaleOptions ? { locale, onLocaleChange } : {}),
    ...(remountOnLocaleChange ? { onRemount: () => remount?.() } : {}),
  });

  const container = document.querySelector(selector);
  if (!(container instanceof HTMLElement)) {
    return;
  }
  history.scrollRestoration = `manual`;

  const rootElement = (
    <App
      children={base === undefined ? app : <Router aroundNav={aroundNav} base={base} children={app} />}
      disableTextSelection={disableTextSelection}
    />
  );
  if (server) {
    hydrateRoot(container, rootElement);
  } else {
    let reactRoot: Root | undefined = createRoot(container);
    reactRoot.render(rootElement);
    remount = () => {
      reactRoot?.unmount();
      reactRoot = createRoot(container);
      reactRoot.render(rootElement);
    };
  }
};
