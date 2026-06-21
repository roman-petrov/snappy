import type { ReactNode } from "react";

import type { TrackItem } from "../core";

import { useRouteStageSlideState } from "./RouteStageSlide.state";
import { RouteStageSlideView } from "./RouteStageSlide.view";

export type RouteStageSlideProps = { children?: ReactNode; items: readonly TrackItem[] };

export const RouteStageSlide = (props: RouteStageSlideProps) => (
  <RouteStageSlideView {...useRouteStageSlideState(props)} />
);
