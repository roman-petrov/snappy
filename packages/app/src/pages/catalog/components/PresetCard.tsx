import { CardButton, type CardButtonProps } from "@snappy/ui";

import styles from "./PresetCard.module.scss";

export type PresetCardProps = Omit<CardButtonProps, `children` | `cn`> & {
  description: string;
  emoji: string;
  title: string;
};

export const PresetCard = ({ description, emoji, title, ...tapProps }: PresetCardProps) => (
  <CardButton {...tapProps} cn={styles.root}>
    <span className={styles.emoji}>{emoji}</span>
    <span className={styles.body}>
      <span className={styles.title}>{title}</span>
      <span className={styles.desc}>{description}</span>
    </span>
  </CardButton>
);
