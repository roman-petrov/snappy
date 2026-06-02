import type { ReactNode } from "react";

import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";

import { App } from "./App";

export type RenderAppOptions = { base?: string; disableSelection?: boolean; location?: string };

export const renderApp = (
  app: ReactNode,
  { base = ``, disableSelection = false, location = `/` }: RenderAppOptions = {},
) =>
  renderToString(
    <App disableSelection={disableSelection}>
      <StaticRouter basename={base} location={location}>
        {app}
      </StaticRouter>
    </App>,
  );
