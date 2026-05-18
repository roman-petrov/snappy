import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { $, Icon, Tap, type TapProps, type Icon as UiIcon } from "@snappy/ui";

import styles from "./SettingsCardRow.module.scss";

export type SettingsCardRowProps = Omit<TapProps, `children` | `cn`> & { end?: ReactNode; icon: UiIcon; text: string };

export const SettingsCardRow = ({ end, icon, text, ...tapProps }: SettingsCardRowProps) => (
  <Tap {...tapProps} cn={_.cn($.tap(`menu`), styles.row)}>
    <Icon name={icon} />
    <span>{text}</span>
    {end === undefined ? undefined : _.isObject(end) ? end : <span className={$.typography(`bodySm`)}>{end}</span>}
  </Tap>
);
