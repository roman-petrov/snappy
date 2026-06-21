import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import styles from "./PageNarrow.module.scss";

export type PageNarrowProps = { children: ReactNode; cn?: string };

export const PageNarrow = ({ children, cn }: PageNarrowProps) => (
  <div className={_.cn(styles.root, cn)}>{children}</div>
);
