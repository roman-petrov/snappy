import type { StaticFormLabel } from "@snappy/snappy-sdk";
import type { ReactNode } from "react";

import { $, Card } from "@snappy/ui";

import styles from "./StaticFormField.module.scss";

export type StaticFormFieldProps = { children: ReactNode; label: StaticFormLabel };

export const StaticFormField = ({ children, label }: StaticFormFieldProps) => (
  <Card cn={styles.field}>
    <div className={styles.labelWrap}>
      <span className={$.typography(`captionBold`)}>{`${label.emoji} ${label.text}`}</span>
    </div>
    <div className={styles.controls}>{children}</div>
  </Card>
);
