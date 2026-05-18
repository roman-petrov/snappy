import type { MaterialSymbol } from "material-symbols";

import { _ } from "@snappy/core";

import { $, type Color, type IconSize } from "../$";
import styles from "./Icon.module.scss";

export type Icon = MaterialSymbol | { emoji: string };

export type IconProps = { cn?: string; color?: Color; name: Icon; size?: IconSize };

export const Icon = ({ cn, color, name, size = `md` }: IconProps) => (
  <span
    className={_.cn(
      styles.root,
      $.iconSize(size),
      _.isString(name) ? styles.material : styles.emoji,
      $.color(color),
      cn,
    )}
  >
    {_.isString(name) ? name : name.emoji}
  </span>
);
