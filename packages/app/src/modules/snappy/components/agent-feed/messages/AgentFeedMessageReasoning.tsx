import { FeedStreamCard } from "../../../../../components";

export type AgentFeedMessageReasoningProps = { onComplete?: (text: string) => void; stream: AsyncIterable<string> };

export const AgentFeedMessageReasoning = (props: AgentFeedMessageReasoningProps) => (
  <FeedStreamCard {...props} theme="reasoning" />
);
