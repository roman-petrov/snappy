import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { $, type Color, type Icon, Text } from "@snappy/ui";

import styles from "./HintPanel.module.scss";
import { IconBadge } from "./IconBadge";

export type HintPanelProps = { actions?: ReactNode; color: Color; description: string; icon: Icon; title: string };

export const HintPanel = ({ actions, color, description, icon, title }: HintPanelProps) => (
  <div className={_.cn(styles.hint, $.surface(`surface`), $.radius(`lg`))}>
    <IconBadge color={color} icon={icon} />
    <div className={styles.body}>
      <Text as="h3" text={title} typography="h3" />
      <Text as="p" text={description} typography="large" />
      {actions === undefined ? undefined : <div className={styles.links}>{actions}</div>}
    </div>
  </div>
);
