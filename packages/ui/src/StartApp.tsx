/* eslint-disable prefer-const */
/* eslint-disable init-declarations */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import type { Action, ReadonlyStore } from "@snappy/core";
import type { RouterBundle } from "@snappy/router";
import type { ReactNode } from "react";

import { createRoot, hydrateRoot } from "react-dom/client";

import { App, AuthLayout, type TabPagerProps } from "./components";
import { Language, Theme } from "./core";
import { AppRouter, type RouteLayerOf, RouteStage } from "./router";
// @ts-expect-error SCSS side-effect import has no TS declarations
import "@snappy/theme/styles/index";

export type StartAppInput = {
  base: string;
  header?: ReactNode;
  layerOf?: RouteLayerOf;
  routes: RouterBundle<unknown>;
  signedIn: ReadonlyStore<boolean>;
  tabs?: Pick<TabPagerProps, `ease` | `items`>;
};

export type StartSiteInput = { children: ReactNode; header?: ReactNode };

const container = () => {
  const element = document.querySelector(`#root`);

  return element instanceof HTMLElement ? element : undefined;
};

export const startApp = ({ base, header, layerOf, routes, signedIn, tabs }: StartAppInput) => {
  const { $: meta, router } = routes;
  const { publicPaths, signInPath } = meta;
  let remount: Action | undefined;

  Theme.init();
  Language.init({ onRemount: () => remount?.() });

  const mountContainer = container();
  if (mountContainer === undefined) {
    return;
  }
  history.scrollRestoration = `manual`;

  const element = (
    <AppRouter base={base} layerOf={layerOf} router={router}>
      <App disableSelection header={header}>
        <AuthLayout publicPaths={publicPaths} signedIn={signedIn} signInPath={signInPath}>
          <RouteStage layerOf={layerOf} tabs={tabs} />
        </AuthLayout>
      </App>
    </AppRouter>
  );

  let reactRoot = createRoot(mountContainer);
  reactRoot.render(element);
  remount = () => {
    reactRoot.unmount();

    reactRoot = createRoot(mountContainer);
    reactRoot.render(element);
  };
};

export const startSite = ({ children, header }: StartSiteInput) => {
  Theme.init();
  Language.init();

  const mountContainer = container();
  if (mountContainer === undefined) {
    return;
  }

  hydrateRoot(
    mountContainer,
    <AppRouter path="/" ssr>
      <App header={header}>{children}</App>
    </AppRouter>,
  );
};
