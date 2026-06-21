import type { ReactNode, Ref } from "react";

import { _ } from "@snappy/core";

import styles from "./ContentColumn.module.scss";

export type ContentColumnProps = { children?: ReactNode; cn?: string; ref?: Ref<HTMLDivElement> };

export const ContentColumn = ({ children, cn, ref }: ContentColumnProps) => (
  <div className={_.cn(styles.root, cn)} ref={ref}>
    {children}
  </div>
);
