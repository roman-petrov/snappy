import { _ } from "@snappy/core";

import { $, type IconSize } from "../$";
import styles from "./CircleEmoji.module.scss";

export type CircleEmojiProps = { cn?: string; emoji: string; size?: IconSize };

export const CircleEmoji = ({ cn, emoji, size = `xxl` }: CircleEmojiProps) => (
  <span className={_.cn(styles.root, $.iconSize(size), cn)}>
    <span className={styles.glyph}>{emoji}</span>
  </span>
);
