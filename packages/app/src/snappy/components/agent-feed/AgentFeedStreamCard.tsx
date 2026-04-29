import { StreamingText, type StreamingTextProps } from "@snappy/ui";

import { FeedPanel } from "../FeedPanel";
import styles from "./AgentFeedStreamCard.module.scss";

export type AgentFeedStreamCardProps = StreamingTextProps & { active?: boolean };

export const AgentFeedStreamCard = ({ active = false, ...props }: AgentFeedStreamCardProps) => (
  <div className={styles.root}>
    <FeedPanel active={active}>
      <StreamingText {...props} />
    </FeedPanel>
  </div>
);
