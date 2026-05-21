/* eslint-disable init-declarations */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import { App } from "./App";
import { Language, Theme } from "./core";
// @ts-expect-error SCSS side-effect import has no TS declarations
import "@snappy/theme/styles/index";

export type CreateRouter = (basename: string) => ReturnType<typeof createBrowserRouter>;

export type StartAppContent = CreateRouter | ReactNode;

export type StartAppOptions = { base?: string; disableLinkSelection?: boolean; disableTextSelection?: boolean };

const mountSelector = `#root`;
let remount: (() => void) | undefined;

export const startApp = async (
  content: StartAppContent,
  { base = ``, disableLinkSelection = false, disableTextSelection = false }: StartAppOptions = {},
) => {
  Theme.init();
  Language.init({ onRemount: () => remount?.() });

  const container = document.querySelector(mountSelector);
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
      disableLinkSelection={disableLinkSelection}
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
