import type { ReactNode } from "react";

import { useAppState } from "./App.state";
import { AppView } from "./App.view";

export type AppProps = { children: ReactNode; disableTextSelection?: boolean };

export const App = (props: AppProps) => <AppView {...useAppState(props)} />;
