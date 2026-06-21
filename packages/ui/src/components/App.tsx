import type { TrackItem } from "@snappy/app-router";
import type { ReactNode } from "react";

import { useAppState } from "./App.state";
import { AppView } from "./App.view";

export type AppProps = {
  children?: ReactNode;
  content?: boolean;
  disableSelection?: boolean;
  header?: ReactNode;
  track?: readonly TrackItem[];
};

export const App = (props: AppProps) => <AppView {...useAppState(props)} />;
