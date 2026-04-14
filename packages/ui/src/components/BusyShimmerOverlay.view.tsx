import type { useBusyShimmerOverlayState } from "./BusyShimmerOverlay.state";

import styles from "./BusyShimmerOverlay.module.scss";

export type BusyShimmerOverlayViewProps = ReturnType<typeof useBusyShimmerOverlayState>;

export const BusyShimmerOverlayView = ({ containerRef }: BusyShimmerOverlayViewProps) => (
  <div className={styles.container} ref={containerRef} />
);
