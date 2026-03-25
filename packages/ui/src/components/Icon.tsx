/* eslint-disable react/no-danger */
import { _ } from "@snappy/core";

import { Icons } from "../assets";
import styles from "./Icon.module.scss";

export type Icon = keyof typeof Icons | { emoji: string };

export type IconProps = { cn?: string; name: Icon };

export const Icon = ({ cn = ``, name }: IconProps) =>
  _.isString(name) ? (
    <span aria-hidden className={`${styles.root} ${cn}`.trim()} dangerouslySetInnerHTML={{ __html: Icons[name] }} />
  ) : (
    <span aria-hidden className={`${styles.root} ${styles.rootEmoji} ${cn}`.trim()}>
      {name.emoji}
    </span>
  );
