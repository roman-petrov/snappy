import { Icon, Text } from "@snappy/ui";

import styles from "./PresetMetaPageTitle.module.scss";

export type PresetMetaPageTitleProps = { emoji: string; title: string };

export const PresetMetaPageTitle = ({ emoji, title }: PresetMetaPageTitleProps) => (
  <div className={styles.root}>
    <Icon icon={emoji} size="md" />
    <Text as="span" cn={styles.label} text={title} typography="h3" />
  </div>
);
