import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import styles from "./SafeArea.module.scss";

export type SafeAreaProps = {
  bottom?: boolean;
  children: ReactNode;
  cn?: string;
  left?: boolean;
  right?: boolean;
  top?: boolean;
};

export const SafeArea = ({ bottom = false, children, cn, left = false, right = false, top = false }: SafeAreaProps) => (
  <div className={_.cn(top && styles.top, right && styles.right, bottom && styles.bottom, left && styles.left, cn)}>
    {children}
  </div>
);
