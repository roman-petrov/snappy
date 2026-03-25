import type { ReactNode } from "react";

import styles from "./SettingsPanelRow.module.scss";

export type SettingsPanelRowProps = { children: ReactNode; label: string };

export const SettingsPanelRow = ({ children, label }: SettingsPanelRowProps) => (
  <div className={styles.row}>
    <div className={styles.label}>{label}</div>
    <div className={styles.scroller}>
      <div className={styles.scrollContent}>{children}</div>
    </div>
  </div>
);
