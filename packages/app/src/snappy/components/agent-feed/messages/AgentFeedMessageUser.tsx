import { Card } from "@snappy/ui";

import styles from "./AgentFeedMessageUser.module.scss";

export type AgentFeedMessageUserProps = { text: string };

export const AgentFeedMessageUser = ({ text }: AgentFeedMessageUserProps) => (
  <div className={styles.root}>
    <Card cn={styles.bubble}>{text}</Card>
  </div>
);
