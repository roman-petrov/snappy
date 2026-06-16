import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import styles from "./HeaderButtonGroup.module.scss";

export type HeaderButtonGroupProps = { children: ReactNode; compact?: boolean };

export const HeaderButtonGroup = ({ children, compact = false }: HeaderButtonGroupProps) => (
  <div className={_.cn(styles.root, compact && styles.compact)}>{children}</div>
);
