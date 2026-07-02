import { _ } from "@snappy/core";
import { $, type Color, Icon } from "@snappy/ui";

import styles from "./IconBadge.module.scss";

export type IconBadgeProps = { color: Color; icon: Icon };

export const IconBadge = ({ color, icon }: IconBadgeProps) => (
  <span className={_.cn(styles.badge, $.bg(color), $.color(`inverse`))}>
    <Icon icon={icon} size="md" />
  </span>
);
