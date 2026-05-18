import { AiStream, type AiStreamProps } from "@snappy/ai-stream";

import { FeedPanel } from "../FeedPanel";
import styles from "./AgentFeedStreamCard.module.scss";

export type AgentFeedStreamCardProps = AiStreamProps & { active?: boolean };

export const AgentFeedStreamCard = ({ active = false, ...props }: AgentFeedStreamCardProps) => (
  <div className={styles.root}>
    <FeedPanel active={active}>
      <AiStream {...props} />
    </FeedPanel>
  </div>
);
