/* eslint-disable prefer-const */
/* eslint-disable init-declarations */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import type { ReactNode } from "react";

import { _, type Action, type ReadonlyStore } from "@snappy/core";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";

import { App } from "./App";
import { AuthLayout } from "./components/AuthLayout";
import { Language, Theme } from "./core";
// @ts-expect-error SCSS side-effect import has no TS declarations
import "@snappy/theme/styles/index";

export type StartAppInput = {
  base: string;
  header?: ReactNode;
  index: ReactNode;
  path: string;
  publicPaths: readonly string[];
  routes: Record<string, ReactNode>;
  signedIn: ReadonlyStore<boolean>;
  signInPath: string;
};

const container = () => {
  const element = document.querySelector(`#root`);

  return element instanceof HTMLElement ? element : undefined;
};

export const startApp = ({ base, header, index, path, publicPaths, routes, signedIn, signInPath }: StartAppInput) => {
  let remount: Action | undefined;

  Theme.init();
  Language.init({ onRemount: () => remount?.() });

  const mountContainer = container();
  if (mountContainer === undefined) {
    return;
  }
  history.scrollRestoration = `manual`;

  const router = createBrowserRouter(
    [
      {
        children: [
          { element: index, index: true },
          ..._.entries(routes).map(([routePath, element]) => ({ element, path: routePath })),
          { element: <Navigate replace to={path} />, path: `*` },
        ],
        element: <AuthLayout header={header} publicPaths={publicPaths} signedIn={signedIn} signInPath={signInPath} />,
        path,
      },
    ],
    { basename: base },
  );

  const element = <App disableSelection router={router} />;
  let reactRoot = createRoot(mountContainer);
  reactRoot.render(element);
  remount = () => {
    reactRoot.unmount();
    reactRoot = createRoot(mountContainer);
    reactRoot.render(element);
  };
};

export const startSite = (component: ReactNode) => {
  Theme.init();
  Language.init();

  const mountContainer = container();
  if (mountContainer === undefined) {
    return;
  }

  hydrateRoot(
    mountContainer,
    <App router={createBrowserRouter(createRoutesFromElements(<Route element={component} path="*" />))} />,
  );
};
