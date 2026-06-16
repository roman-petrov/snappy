import { _ } from "@snappy/core";

import type { useRouteScrollState } from "./RouteScroll.state";

import { SafeArea } from "../../components/SafeArea";
import styles from "./RouteScroll.module.scss";

export type RouteScrollViewProps = ReturnType<typeof useRouteScrollState>;

export const RouteScrollView = ({ children, dimmed, paddingBottom, ref, safeArea, scroll }: RouteScrollViewProps) => {
  const body = (
    <div
      className={_.cn(styles.scroll, scroll && styles.scrollY, dimmed && styles.scrollDimmed)}
      ref={ref}
      style={paddingBottom === undefined ? undefined : { paddingBottom }}
    >
      {children}
    </div>
  );

  return safeArea ? <SafeArea bottom>{body}</SafeArea> : body;
};
