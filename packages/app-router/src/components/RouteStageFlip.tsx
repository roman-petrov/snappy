import type { RouterPageState } from "@snappy/router";
import type { ReactNode } from "react";

import { useRouteStageFlipState } from "./RouteStageFlip.state";
import { RouteStageFlipView } from "./RouteStageFlip.view";

export type RouteStageFlipProps = { children?: ReactNode; page?: RouterPageState };

export const RouteStageFlip = (props: RouteStageFlipProps) => <RouteStageFlipView {...useRouteStageFlipState(props)} />;
