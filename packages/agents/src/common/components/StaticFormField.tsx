import type { ReactNode } from "react";

import styles from "./StaticFormField.module.scss";

export type StaticFormFieldProps = { children: ReactNode; label: string };

export const StaticFormField = ({ children, label }: StaticFormFieldProps) => (
  <section className={styles.card}>
    <div className={styles.head}>
      <span className={styles.label}>{label}</span>
    </div>
    <div className={styles.body}>{children}</div>
  </section>
);
