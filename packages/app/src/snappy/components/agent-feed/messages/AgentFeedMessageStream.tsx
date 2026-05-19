import { AiStream } from "@snappy/ai-stream";

import { FeedPanel } from "../../FeedPanel";
import styles from "./AgentFeedMessageStream.module.scss";

export type AgentFeedMessageStreamProps = { stream: AsyncIterable<string> };

export const AgentFeedMessageStream = ({ stream }: AgentFeedMessageStreamProps) => (
  <div className={styles.root}>
    <FeedPanel>
      <AiStream color="text" stream={stream} typography="caption" />
    </FeedPanel>
  </div>
);
