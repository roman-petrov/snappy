import type { ReactNode } from "react";

import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";

import { App } from "./App";

export type RenderAppOptions = {
  base?: string;
  disableLinkSelection?: boolean;
  disableTextSelection?: boolean;
  location?: string;
};

export const renderApp = (
  app: ReactNode,
  { base = ``, disableLinkSelection = false, disableTextSelection = false, location = `/` }: RenderAppOptions = {},
) =>
  renderToString(
    <App disableLinkSelection={disableLinkSelection} disableTextSelection={disableTextSelection}>
      <StaticRouter basename={base} location={location}>
        {app}
      </StaticRouter>
    </App>,
  );
