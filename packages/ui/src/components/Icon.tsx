import type { LucideIcon } from "lucide-react";

import { _ } from "@snappy/core";

import { $, type Color, type IconSize } from "../$";
import styles from "./Icon.module.scss";

export type Icon = LucideIcon | string;

export type IconProps = { cn?: string; color?: Color; icon: Icon; size?: IconSize };

export const Icon = ({ cn, color, icon, size = `md` }: IconProps) => {
  if (_.isString(icon)) {
    return <span className={_.cn(styles.root, $.iconSize(size), styles.emoji, $.color(color), cn)}>{icon}</span>;
  }

  const Svg = icon;
  const strokeWidth = 1.75;

  return (
    <span className={_.cn(styles.root, $.iconSize(size), styles.icon, $.color(color), cn)}>
      <Svg aria-hidden strokeWidth={strokeWidth} />
    </span>
  );
};
