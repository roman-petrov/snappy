import type { ReactNode } from "react";

import styles from "./SettingsPanelRow.module.scss";

export type SettingsPanelRowProps = { children: ReactNode };

export const SettingsPanelRow = ({ children }: SettingsPanelRowProps) => (
  <div className={styles.row}>
    <div className={styles.scroller}>
      <div className={styles.scrollContent}>{children}</div>
    </div>
  </div>
);
