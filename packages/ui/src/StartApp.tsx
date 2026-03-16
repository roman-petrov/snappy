/* eslint-disable init-declarations */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, StaticRouter } from "react-router-dom";

import { App } from "./App";
import { Locale, Theme } from "./core";
import "@snappy/theme/styles";

export type CreateRouter = (basename: string) => ReturnType<typeof createBrowserRouter>;

export type RenderAppOptions = { base?: string; disableTextSelection?: boolean; location?: string };

export type StartAppContent = CreateRouter | ReactNode;

export type StartAppOptions = { base?: string; disableTextSelection?: boolean };

let remount: (() => void) | undefined;

export const startApp = async (
  selector: string,
  content: StartAppContent,
  { base = ``, disableTextSelection = false }: StartAppOptions = {},
) => {
  Theme.init();
  Locale.init({ onRemount: () => remount?.() });

  const container = document.querySelector(selector);
  if (!(container instanceof HTMLElement)) {
    return;
  }
  history.scrollRestoration = `manual`;

  const rootElement = (
    <App
      children={
        <RouterProvider
          router={
            _.isFunction(content)
              ? content(base)
              : createBrowserRouter(createRoutesFromElements(<Route element={content} path="*" />), { basename: base })
          }
        />
      }
      disableTextSelection={disableTextSelection}
    />
  );

  const isSsr = container.hasChildNodes();
  if (isSsr) {
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

export const renderApp = (
  app: ReactNode,
  { base = ``, disableTextSelection = false, location = `/` }: RenderAppOptions = {},
) =>
  renderToString(
    <App disableTextSelection={disableTextSelection}>
      <StaticRouter basename={base} location={location}>
        {app}
      </StaticRouter>
    </App>,
  );
