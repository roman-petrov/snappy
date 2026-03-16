import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { Tap, type TapProps } from "@snappy/ui";

import styles from "./SettingsCardRow.module.scss";

export type SettingsCardRowProps = Omit<TapProps, `children` | `cn`> & { end?: ReactNode; icon: string; text: string };

export const SettingsCardRow = ({ end, icon, text, ...tapProps }: SettingsCardRowProps) => (
  <Tap {...tapProps} cn={styles.row}>
    <span aria-hidden className={styles.rowIcon}>
      {icon}
    </span>
    <span className={styles.rowLabel}>{text}</span>
    {end === undefined ? undefined : _.isObject(end) ? end : <span className={styles.rowValue}>{end}</span>}
  </Tap>
);
