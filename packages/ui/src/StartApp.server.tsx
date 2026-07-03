import type { ReactNode } from "react";

import { AppRouter } from "@snappy/app-router";
import { renderToString } from "react-dom/server";

import { AppSite } from "./components";

export type RenderSiteOptions = { header?: ReactNode; path?: string };

export const renderSite = (app: ReactNode, { header, path = `/` }: RenderSiteOptions = {}) =>
  renderToString(
    <AppRouter path={path} ssr>
      <AppSite header={header}>{app}</AppSite>
    </AppRouter>,
  );
