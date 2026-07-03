import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import styles from "./SettingsRow.module.scss";

export type SettingsRowProps = { children: ReactNode; icon?: ReactNode; right?: ReactNode };

export const SettingsRow = ({ children, icon, right }: SettingsRowProps) => (
  <div className={_.cn(styles.row, icon === undefined && styles.rowNoIcon)}>
    {icon}
    {children}
    {right}
  </div>
);
