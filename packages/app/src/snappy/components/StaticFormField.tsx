import type { StaticFormLabel } from "@snappy/snappy-sdk";
import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { $ } from "@snappy/ui";

import styles from "./StaticFormField.module.scss";

export type StaticFormFieldProps = { children: ReactNode; label: StaticFormLabel };

export const StaticFormField = ({ children, label }: StaticFormFieldProps) => (
  <section className={styles.field}>
    <div className={_.cn(styles.labelWrap, $.surface(`surface`), $.elevation(`e1`), $.radius(`sm`))}>
      <span className={$.typography(`captionBold`)}>{`${label.emoji} ${label.text}`}</span>
    </div>
    <div className={styles.controls}>{children}</div>
  </section>
);
