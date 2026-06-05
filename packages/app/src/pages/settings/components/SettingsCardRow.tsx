import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { $, Tap, type TapProps, Text } from "@snappy/ui";

import styles from "./SettingsCardRow.module.scss";

export type SettingsCardRowProps = Omit<TapProps, `children` | `cn`> & {
  bottom?: string;
  icon?: ReactNode;
  right?: ReactNode;
  text: string;
};

export const SettingsCardRow = ({ bottom, icon, right, text, ...tapProps }: SettingsCardRowProps) => (
  <Tap {...tapProps} cn={_.cn($.tap(`menu`), styles.row, icon === undefined && styles.rowNoIcon)}>
    {icon}
    <span className={styles.text}>
      <Text color="primary" text={text} />
      {bottom === undefined ? undefined : <Text text={bottom} typography="bodySm" />}
    </span>
    {right}
  </Tap>
);
