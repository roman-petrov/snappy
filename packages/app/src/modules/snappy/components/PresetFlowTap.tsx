import { _ } from "@snappy/core";
import { Tap, type TapProps, Text } from "@snappy/ui";

import styles from "./PresetFlowTap.module.scss";

export type PresetFlowTapProps = Omit<TapProps, `children` | `cn`> & {
  description: string;
  emoji: string;
  title: string;
  tone: PresetFlowTapTone;
};

export type PresetFlowTapTone = Exclude<keyof typeof styles, `art` | `content` | `description` | `root` | `title`>;

export const PresetFlowTap = ({ description, emoji, title, tone, ...tapProps }: PresetFlowTapProps) => (
  <Tap {...tapProps} cn={_.cn(styles.root, styles[tone])}>
    <span className={styles.art}>{emoji}</span>
    <span className={styles.content}>
      <Text cn={styles.title} text={title} typography="h3" />
      <Text text={description} typography="caption" />
    </span>
  </Tap>
);
