import type { ReactNode } from "react";

import styles from "./HeaderButtonGroup.module.scss";

export type HeaderButtonGroupProps = { children: ReactNode };

export const HeaderButtonGroup = ({ children }: HeaderButtonGroupProps) => (
  <div className={styles.root}>{children}</div>
);
