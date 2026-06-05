import { _ } from "@snappy/core";

import { $, type Color, type IconSize } from "../$";
import styles from "./FilledIcon.module.scss";
import { Icon, type Icon as IconType } from "./Icon";

export type FilledIconProps = { cn?: string; color: Color; icon: IconType; size?: IconSize };

export const FilledIcon = ({ cn, color, icon, size = `sm` }: FilledIconProps) => (
  <span className={_.cn(styles.root, $.bg(color), $.color(`inverse`), cn)}>
    <Icon icon={icon} size={size} />
  </span>
);
