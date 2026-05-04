import { StreamingText, type StreamingTextProps } from "@snappy/ui";

import styles from "./AgentFeedStreamRow.module.scss";

export const AgentFeedStreamRow = (props: StreamingTextProps) => (
  <div className={styles.root}>
    <StreamingText {...props} />
  </div>
);
