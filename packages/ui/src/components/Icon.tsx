import { Html } from "@snappy/browser";
import { _ } from "@snappy/core";

import { $, type Color } from "../$";
import { Icons } from "../assets";
import styles from "./Icon.module.scss";

export type Icon = keyof typeof Icons | { emoji: string };

export type IconProps = { cn?: string; color?: Color; name: Icon };

export const Icon = ({ cn = ``, color, name }: IconProps) =>
  _.isString(name) ? (
    <span
      aria-hidden
      className={_.cn(styles.root, color === undefined ? `` : $.color(color), cn)}
      {...Html.text(Icons[name])}
    />
  ) : (
    <span aria-hidden className={_.cn(styles.root, styles.rootEmoji, color === undefined ? `` : $.color(color), cn)}>
      {name.emoji}
    </span>
  );
