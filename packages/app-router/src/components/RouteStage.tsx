import type { ReactNode } from "react";

import type { TrackItem } from "../core";

import { useRouteStageState } from "./RouteStage.state";
import { RouteStageView } from "./RouteStage.view";

export type RouteStageProps = { children?: ReactNode; content?: boolean; track?: readonly TrackItem[] };

export const RouteStage = ({ children, ...props }: RouteStageProps) => (
  <RouteStageView {...useRouteStageState(props)}>{children}</RouteStageView>
);
