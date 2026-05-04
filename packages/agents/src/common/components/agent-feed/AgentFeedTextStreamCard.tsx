import { FeedCard, StreamingText } from "@snappy/ui";

import styles from "./AgentFeedTextStreamCard.module.scss";

export type AgentFeedTextStreamCardProps = { chunks: AsyncIterable<string> };

export const AgentFeedTextStreamCard = ({ chunks }: AgentFeedTextStreamCardProps) => (
  <FeedCard busy>
    <div className={styles.body}>
      <StreamingText chunks={chunks} typography="body" />
    </div>
  </FeedCard>
);
