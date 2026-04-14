import { useBusyShimmerOverlayState } from "./BusyShimmerOverlay.state";
import { BusyShimmerOverlayView } from "./BusyShimmerOverlay.view";

export type BusyShimmerOverlayProps = { accentColor?: number; speed?: number };

export const BusyShimmerOverlay = (props: BusyShimmerOverlayProps) => (
  <BusyShimmerOverlayView {...useBusyShimmerOverlayState(props)} />
);
