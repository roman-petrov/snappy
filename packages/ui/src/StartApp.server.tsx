import type { ReactNode } from "react";

import { AppRouter } from "@snappy/app-router";
import { renderToString } from "react-dom/server";

import { AppSite } from "./components";

export type RenderSiteOptions = { header?: ReactNode };

export const renderSite = (app: ReactNode, { header }: RenderSiteOptions = {}) =>
  renderToString(
    <AppRouter path="/" ssr>
      <AppSite header={header}>{app}</AppSite>
    </AppRouter>,
  );
