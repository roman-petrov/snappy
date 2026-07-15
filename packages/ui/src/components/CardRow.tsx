import type { ReactNode } from "react";

import styles from "./CardRow.module.scss";
import { CircleEmoji } from "./CircleEmoji";

export type CardRowProps = { children: ReactNode; emoji: string };

export const CardRow = ({ children, emoji }: CardRowProps) => (
  <span className={styles.root}>
    <CircleEmoji emoji={emoji} />
    <span className={styles.body}>{children}</span>
  </span>
);
