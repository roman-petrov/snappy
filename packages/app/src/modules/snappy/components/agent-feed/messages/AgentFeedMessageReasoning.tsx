import type { TypeWriterSpeed } from "@snappy/domain";

import { FeedStreamCard } from "../../../../../components";

export type AgentFeedMessageReasoningProps = {
  onComplete?: (text: string) => void;
  stream: AsyncIterable<string>;
  typeWriterSpeed?: TypeWriterSpeed;
};

export const AgentFeedMessageReasoning = (props: AgentFeedMessageReasoningProps) => (
  <FeedStreamCard {...props} theme="reasoning" />
);
