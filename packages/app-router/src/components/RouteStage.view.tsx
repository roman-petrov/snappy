import type { ReactNode } from "react";

import type { useRouteStageState } from "./RouteStage.state";

import { RouteStageContext } from "../core";
import styles from "./RouteStage.module.scss";
import { RouteStageCover } from "./RouteStageCover";
import { RouteStageFlip } from "./RouteStageFlip";
import { RouteStageSlide } from "./RouteStageSlide";
import { StageFade } from "./StageFade";

export type RouteStageViewProps = ReturnType<typeof useRouteStageState> & { children?: ReactNode };

export const RouteStageView = ({
  children,
  content,
  contentPage,
  panes,
  slide,
  stage,
  trackItems,
}: RouteStageViewProps) => (
  <RouteStageContext value={stage}>
    <div className={styles.root}>
      <div className={styles.shellDock} ref={stage.shellDockRef} />
      <RouteStageCover panes={panes} />
      {slide ? (
        <RouteStageSlide items={trackItems ?? []}>{children}</RouteStageSlide>
      ) : (
        <RouteStageFlip page={content ? undefined : contentPage}>{content ? children : undefined}</RouteStageFlip>
      )}
      <StageFade minHeight={stage.insets.shell.fadeMinHeight} />
    </div>
  </RouteStageContext>
);
