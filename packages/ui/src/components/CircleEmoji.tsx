import { _ } from "@snappy/core";

import styles from "./CircleEmoji.module.scss";

export type CircleEmojiProps = { cn?: string; emoji: string };

export const CircleEmoji = ({ cn, emoji }: CircleEmojiProps) => <span className={_.cn(styles.root, cn)}>{emoji}</span>;
