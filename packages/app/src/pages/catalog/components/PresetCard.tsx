import { Tap, type TapProps } from "@snappy/ui";

import styles from "./PresetCard.module.scss";

export type PresetCardProps = Omit<TapProps, `children` | `cn`> & { description: string; emoji: string; title: string };

export const PresetCard = ({ description, emoji, title, ...tapProps }: PresetCardProps) => (
  <Tap {...tapProps} cn={styles.root}>
    <span className={styles.emoji}>{emoji}</span>
    <span className={styles.body}>
      <span className={styles.title}>{title}</span>
      <span className={styles.desc}>{description}</span>
    </span>
  </Tap>
);
