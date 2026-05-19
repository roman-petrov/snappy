import { AiStream } from "@snappy/ai-stream";

import { FeedPanel } from "../../FeedPanel";
import styles from "./AgentFeedMessageStream.module.scss";

export type AgentFeedMessageStreamProps = { active?: boolean; stream: AsyncIterable<string> };

export const AgentFeedMessageStream = ({ active = false, stream }: AgentFeedMessageStreamProps) => (
  <div className={styles.root}>
    <FeedPanel active={active}>
      <AiStream color="text" stream={stream} typography="caption" />
    </FeedPanel>
  </div>
);
