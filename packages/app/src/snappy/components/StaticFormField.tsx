import type { StaticFormLabel } from "@snappy/snappy-sdk";
import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { $ } from "@snappy/ui";

import styles from "./StaticFormField.module.scss";

export type StaticFormFieldProps = { children: ReactNode; cn?: string; label: StaticFormLabel };

export const StaticFormField = ({ children, cn, label }: StaticFormFieldProps) => (
  <section className={_.cn(styles.field, cn)}>
    <div className={styles.labelWrap}>
      <span className={$.typography(`captionBold`)}>{`${label.emoji} ${label.text}`}</span>
    </div>
    <div className={styles.controls}>{children}</div>
  </section>
);
