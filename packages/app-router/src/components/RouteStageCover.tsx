import type { OverlayPane } from "../core";

import { useRouteStageCoverState } from "./RouteStageCover.state";
import { RouteStageCoverView } from "./RouteStageCover.view";

export type RouteStageCoverProps = { panes: readonly OverlayPane[] };

export const RouteStageCover = (props: RouteStageCoverProps) => (
  <RouteStageCoverView {...useRouteStageCoverState(props)} />
);
