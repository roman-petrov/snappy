import { AiStream } from "@snappy/ai-stream";

import { FeedPanel } from "../../FeedPanel";
import styles from "./AgentFeedMessageReasoning.module.scss";

export type AgentFeedMessageReasoningProps = { stream: AsyncIterable<string> };

export const AgentFeedMessageReasoning = ({ stream }: AgentFeedMessageReasoningProps) => (
  <div className={styles.root}>
    <FeedPanel>
      <AiStream color="outline" stream={stream} typography="captionSm" />
    </FeedPanel>
  </div>
);
