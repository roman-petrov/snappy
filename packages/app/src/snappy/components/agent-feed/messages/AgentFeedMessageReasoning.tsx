import { AiStream } from "@snappy/ai-stream";

import { FeedPanel } from "../../FeedPanel";
import styles from "./AgentFeedMessageReasoning.module.scss";

export type AgentFeedMessageReasoningProps = { active?: boolean; stream: AsyncIterable<string> };

export const AgentFeedMessageReasoning = ({ active = false, stream }: AgentFeedMessageReasoningProps) => (
  <div className={styles.root}>
    <FeedPanel active={active}>
      <AiStream color="outline" stream={stream} typography="captionSm" />
    </FeedPanel>
  </div>
);
