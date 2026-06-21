import { memo } from "react";

import type { useRouteStageSlideState } from "./RouteStageSlide.state";

import { RouteStageContext } from "../core";
import { RoutePageTrack } from "./RoutePageTrack";
import { RouterPage } from "./RouterPage";

export type RouteStageSlideViewProps = ReturnType<typeof useRouteStageSlideState>;

type LanesProps = RouteStageSlideViewProps[`lanes`];

const Lanes = ({ contentDimmed, contentRef, items, laneRef, scrollPaddingBottom }: LanesProps) => (
  <RoutePageTrack
    dimmed={contentDimmed}
    lanes={items.map(item => ({ children: <RouterPage path={item.path} />, key: item.path }))}
    paddingBottom={scrollPaddingBottom}
    ref={contentRef}
    trackRef={laneRef}
  />
);

const LanesMemo = memo(Lanes);

export const RouteStageSlideView = ({ children, lanes, stage }: RouteStageSlideViewProps) => (
  <RouteStageContext value={stage}>
    <LanesMemo {...lanes} />
    {children}
  </RouteStageContext>
);
