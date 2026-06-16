import { _ } from "@snappy/core";

import type { useRouteStageState } from "./RouteStage.state";

import { TabPager } from "../../components";
import { SafeArea } from "../../components/SafeArea";
import { RouteStageContext } from "../RouteStageContext";
import { RouterPage } from "./RouterPage";
import { RouteScroll } from "./RouteScroll";
import styles from "./RouteStage.module.scss";

export type RouteStageViewProps = ReturnType<typeof useRouteStageState>;

export const RouteStageView = ({
  fade,
  overlayOpen,
  overlayRef,
  page,
  panes,
  stage,
  tabs,
  topPaneRef,
}: RouteStageViewProps) => (
  <div className={styles.root}>
    <RouteStageContext value={stage}>
      <div className={styles.stage}>
        <div className={_.cn(styles.overlay, overlayOpen && styles.overlayOpen)} ref={overlayRef}>
          {panes.map(({ active, pattern, stacked, state }) => (
            <div
              className={_.cn(styles.pane, active && styles.paneActive, stacked && styles.paneStacked)}
              key={pattern}
              ref={active ? topPaneRef : undefined}
              style={active && stage.scrollSafeArea ? { paddingBottom: stage.scrollPaddingBottom } : undefined}
            >
              <SafeArea bottom={active && stage.scrollSafeArea} cn={styles.paneContent}>
                <RouterPage {...state} />
              </SafeArea>
            </div>
          ))}
        </div>
        {tabs === undefined ? (
          <RouteScroll ref={stage.contentRef} scroll>
            {page === undefined ? undefined : <RouterPage {...page} />}
          </RouteScroll>
        ) : (
          <TabPager {...tabs} />
        )}
      </div>
      {fade !== `hidden` && <div aria-hidden className={fade === `chrome` ? styles.fadeChrome : styles.fadeSafeArea} />}
    </RouteStageContext>
  </div>
);
