import { Icon, Text } from "@snappy/ui";

import styles from "./AgentPageTitle.module.scss";

export type AgentPageTitleProps = { emoji: string; title: string };

export const AgentPageTitle = ({ emoji, title }: AgentPageTitleProps) => (
  <div className={styles.root}>
    <Icon icon={emoji} size="md" />
    <Text as="h1" text={title} typography="h3" />
  </div>
);
