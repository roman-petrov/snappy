import { _ } from "@snappy/core";

import type { useRouteStageFlipState } from "./RouteStageFlip.state";

import { RoutePageTrack } from "./RoutePageTrack";
import { RouterPage } from "./RouterPage";
import styles from "./RouteStageFlip.module.scss";

export type RouteStageFlipViewProps = ReturnType<typeof useRouteStageFlipState>;

export const RouteStageFlipView = ({
  children,
  contentRef,
  hostRef,
  inRef,
  outgoing,
  outRef,
  page,
  scrollPaddingBottom,
}: RouteStageFlipViewProps) => (
  <RoutePageTrack paddingBottom={scrollPaddingBottom} ref={contentRef}>
    {children ??
      (outgoing === undefined ? (
        page === undefined ? undefined : (
          <RouterPage {...page} />
        )
      ) : (
        <div className={styles.flip} ref={hostRef}>
          <div className={_.cn(styles.page, styles.pageOut)} ref={outRef}>
            <RouterPage {...outgoing} />
          </div>
          <div className={styles.page} ref={inRef}>
            {page === undefined ? undefined : <RouterPage {...page} />}
          </div>
        </div>
      ))}
  </RoutePageTrack>
);
