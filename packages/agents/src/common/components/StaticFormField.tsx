import type { ReactNode } from "react";

import styles from "./StaticFormField.module.scss";

export type StaticFormFieldProps = {
  alignControl?: `end` | `stretch`;
  children: ReactNode;
  label: string;
};

export const StaticFormField = ({ alignControl = `stretch`, children, label }: StaticFormFieldProps) => (
  <section className={styles.card}>
    <div className={styles.head}>
      <span className={styles.label}>{label}</span>
    </div>
    <div className={alignControl === `end` ? styles.bodyEnd : styles.body}>{children}</div>
  </section>
);
