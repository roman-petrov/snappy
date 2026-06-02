import type { ReactNode } from "react";
import type { createBrowserRouter } from "react-router-dom";

import { useAppState } from "./App.state";
import { AppView } from "./App.view";

export type AppProps = {
  children?: ReactNode;
  disableSelection?: boolean;
  router?: ReturnType<typeof createBrowserRouter>;
};

export const App = (props: AppProps) => <AppView {...useAppState(props)} />;
