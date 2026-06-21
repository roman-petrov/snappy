import type { ReactNode, Ref } from "react";

import { _ } from "@snappy/core";

import styles from "./RoutePageTrack.module.scss";

export type RoutePageTrackProps = {
  children?: ReactNode;
  dimmed?: boolean;
  lanes?: readonly { children: ReactNode; key: string }[];
  paddingBottom?: string;
  ref?: Ref<HTMLDivElement>;
  trackRef?: Ref<HTMLDivElement>;
};

export const RoutePageTrack = ({
  children,
  dimmed = false,
  lanes,
  paddingBottom,
  ref,
  trackRef,
}: RoutePageTrackProps) => {
  const lane = (content: ReactNode, key?: string) => (
    <div className={styles.lane} key={key} style={{ paddingBottom }}>
      {content}
    </div>
  );

  return (
    <div className={_.cn(styles.host, dimmed && styles.hostDimmed)} ref={ref}>
      <div className={styles.track} ref={trackRef} style={{ [`--lane-count` as string]: lanes?.length ?? 1 }}>
        {lanes === undefined ? lane(children) : lanes.map(({ children: content, key }) => lane(content, key))}
      </div>
    </div>
  );
};
