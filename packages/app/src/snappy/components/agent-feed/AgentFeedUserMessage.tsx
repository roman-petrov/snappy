import { Card } from "@snappy/ui";

import styles from "./AgentFeedUserMessage.module.scss";

export type AgentFeedUserMessageProps = { text: string };

export const AgentFeedUserMessage = ({ text }: AgentFeedUserMessageProps) => (
  <div className={styles.root}>
    <Card cn={styles.bubble}>{text}</Card>
  </div>
);
