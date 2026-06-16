import type { ReactNode } from "react";

import { renderToString } from "react-dom/server";

import { App } from "./components";
import { AppRouter } from "./router";

export type RenderAppOptions = { base?: string; disableSelection?: boolean; header?: ReactNode; location?: string };

export const renderApp = (
  app: ReactNode,
  { base = ``, disableSelection = false, header, location = `/` }: RenderAppOptions = {},
) =>
  renderToString(
    <AppRouter base={base} path={location} ssr>
      <App disableSelection={disableSelection} header={header}>
        {app}
      </App>
    </AppRouter>,
  );
