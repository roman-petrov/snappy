import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { Platform } from "@snappy/platform";

import type { useRouteStageState } from "./RouteStage.state";

import { RouteStageContext } from "../core";
import styles from "./RouteStage.module.scss";
import { StageFade } from "./StageFade";

export type RouteStageViewProps = ReturnType<typeof useRouteStageState> & { children?: ReactNode };

export const RouteStageView = ({
  baseRef,
  children,
  content,
  contentRef,
  cornerRadius,
  coverItems,
  hostRef,
  inRef,
  keyboard,
  laneCount,
  laneRef,
  lanes,
  nested,
  outgoingNode,
  outRef,
  overlayClosing,
  overlayEntering,
  overlayOpen,
  overlayRef,
  pageDockRef,
  pageHostDimmed,
  pageNode,
  paneRef,
  scrollPaddingBottom,
  shellDockRef,
  shellFadeMinHeight,
  slide,
  stage,
}: RouteStageViewProps) => (
  <RouteStageContext value={stage}>
    <div className={styles.root}>
      <div
        className={_.cn(
          styles.overlay,
          overlayOpen && styles.overlayOpen,
          overlayClosing && styles.overlayClosing,
          overlayEntering && styles.overlayEntering,
        )}
        ref={overlayRef}
      >
        {nested ? <div className={styles.overlayBackdrop} /> : undefined}
        {coverItems.map(({ fadeMinHeight, node, pattern, scrollPad, track }) => (
          <div
            className={track ? styles.overlayTop : styles.overlayBase}
            key={pattern}
            ref={track ? paneRef : baseRef}
            style={
              track && Platform() === `native`
                ? { borderBottomLeftRadius: keyboard ? undefined : cornerRadius, borderTopLeftRadius: cornerRadius }
                : undefined
            }
          >
            <div className={styles.paneScroll}>
              <div className={styles.paneBody} style={{ paddingBottom: scrollPad }}>
                {node}
              </div>
            </div>
            <StageFade minHeight={fadeMinHeight} />
            {track ? <div className={styles.pageDock} ref={pageDockRef} /> : undefined}
          </div>
        ))}
      </div>
      <div className={_.cn(styles.pageHost, pageHostDimmed && styles.pageHostDimmed)} ref={contentRef}>
        <div
          className={styles.pageTrack}
          key={slide ? `lanes` : `page`}
          ref={slide ? laneRef : undefined}
          style={{ [`--lane-count` as string]: laneCount }}
        >
          {lanes === undefined ? (
            <div className={styles.pageLane} style={{ paddingBottom: scrollPaddingBottom }}>
              {(content ? children : undefined) ??
                (outgoingNode === undefined ? (
                  pageNode
                ) : (
                  <div className={styles.flip} ref={hostRef}>
                    <div className={_.cn(styles.page, styles.pageOut)} ref={outRef}>
                      {outgoingNode}
                    </div>
                    <div className={styles.page} ref={inRef}>
                      {pageNode}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            lanes.map(lane => (
              <div className={styles.pageLane} key={lane.path} style={{ paddingBottom: scrollPaddingBottom }}>
                {lane.node}
              </div>
            ))
          )}
        </div>
        {slide ? <div className={styles.shellDock} ref={shellDockRef} /> : undefined}
      </div>
      {slide ? children : undefined}
      <StageFade minHeight={shellFadeMinHeight} />
    </div>
  </RouteStageContext>
);
