import { _ } from "@snappy/core";
import { Bridge } from "@snappy/platform";

import type { useRouteStageCoverState } from "./RouteStageCover.state";

import { RouterPage } from "./RouterPage";
import styles from "./RouteStageCover.module.scss";
import { StageFade } from "./StageFade";

export type RouteStageCoverViewProps = ReturnType<typeof useRouteStageCoverState>;

export const RouteStageCoverView = ({
  cornerRadius,
  items,
  keyboard,
  overlayClosing,
  overlayEntering,
  overlayOpen,
  overlayRef,
  pageDockRef,
  paneRef,
  topScrollRef,
}: RouteStageCoverViewProps) => (
  <div
    className={_.cn(
      styles.overlay,
      overlayOpen && styles.overlayOpen,
      overlayClosing && styles.overlayClosing,
      overlayEntering && styles.overlayEntering,
    )}
    ref={overlayRef}
  >
    {items.map(({ base, fadeMinHeight, pane, scrollPad, track }) => (
      <div
        className={base ? styles.overlayBase : styles.overlayTop}
        key={pane.pattern}
        ref={track ? paneRef : undefined}
        style={
          track && Bridge.available
            ? { borderBottomLeftRadius: keyboard ? undefined : cornerRadius, borderTopLeftRadius: cornerRadius }
            : undefined
        }
      >
        <div className={styles.paneScroll} ref={track ? topScrollRef : undefined}>
          <div style={{ paddingBottom: scrollPad }}>
            <div className={styles.paneContent}>
              <RouterPage {...pane.state} />
            </div>
          </div>
        </div>
        <StageFade minHeight={fadeMinHeight} />
        {track ? <div className={styles.pageDock} ref={pageDockRef} /> : undefined}
      </div>
    ))}
  </div>
);
