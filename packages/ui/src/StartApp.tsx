/* eslint-disable prefer-const */
/* eslint-disable init-declarations */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import type { RouterBundle } from "@snappy/router";
import type { ReactNode } from "react";

import { AppRouter, type RouteLayerOf } from "@snappy/app-router";
import { Keyboard } from "@snappy/browser";
import { type Action, Env, type ReadonlyStore } from "@snappy/core";
import { YandexMetrica } from "@snappy/metrics";
import { createRoot, hydrateRoot } from "react-dom/client";

import { App, AppSite, AuthLayout, TabPager, type TabPagerItem } from "./components";
import { Language, Theme } from "./core";
import { MetricsRoute } from "./metrics";
// @ts-expect-error SCSS side-effect import has no TS declarations
import "@snappy/theme/styles/index";

const devCounterId = 110_522_496;
const prodCounterId = 110_522_528;
const metrics = [YandexMetrica(Env.dev() ? devCounterId : prodCounterId)];

export type StartAppInput = {
  base: string;
  header?: ReactNode;
  layerOf?: RouteLayerOf;
  modules?: ReactNode;
  routes: RouterBundle<unknown>;
  signedIn: ReadonlyStore<boolean>;
  tabs?: TabPagerItem[];
};

export type StartSiteInput = { children: ReactNode; header?: ReactNode; path?: string };

const container = () => {
  const element = document.querySelector(`#root`);

  return element instanceof HTMLElement ? element : undefined;
};

export const startApp = ({ base, header, layerOf, modules, routes, signedIn, tabs }: StartAppInput) => {
  const { $: meta, router } = routes;
  const { publicPaths, signInPath } = meta;
  let remount: Action | undefined;

  Keyboard.init();
  Theme.init();
  Language.init({ onRemount: () => remount?.() });

  const mountContainer = container();
  if (mountContainer === undefined) {
    return;
  }
  history.scrollRestoration = `manual`;

  const element = (
    <AppRouter base={base} layerOf={layerOf} router={router}>
      <MetricsRoute metrics={metrics} signedIn={signedIn} />
      <AuthLayout publicPaths={publicPaths} signedIn={signedIn} signInPath={signInPath} />
      <App disableSelection header={header} track={tabs}>
        {tabs === undefined ? undefined : <TabPager items={tabs} />}
      </App>
      {modules}
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

export const startSite = ({ children, header, path = `/` }: StartSiteInput) => {
  Theme.init();
  Language.init();

  const mountContainer = container();
  if (mountContainer === undefined) {
    return;
  }

  hydrateRoot(
    mountContainer,
    <AppRouter path={path} ssr>
      <MetricsRoute metrics={metrics} />
      <AppSite header={header}>{children}</AppSite>
    </AppRouter>,
  );
};
