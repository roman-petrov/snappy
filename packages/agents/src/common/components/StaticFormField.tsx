import type { ReactNode } from "react";

import styles from "./StaticFormField.module.scss";

export type StaticFormFieldProps = { children: ReactNode; label: string };

export const StaticFormField = ({ children, label }: StaticFormFieldProps) => (
  <div className={styles.row}>
    <span className={styles.label}>{label}</span>
    <div className={styles.control}>{children}</div>
  </div>
);
