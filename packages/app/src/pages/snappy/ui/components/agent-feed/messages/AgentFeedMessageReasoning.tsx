import { FeedStreamCard, type FeedStreamCardContentProps } from "../../../../../../components";

export type AgentFeedMessageReasoningProps = Omit<
  Extract<FeedStreamCardContentProps, { text?: never }>,
  `theme` | `typeWriterSpeed`
>;

export const AgentFeedMessageReasoning = (props: AgentFeedMessageReasoningProps) => (
  <FeedStreamCard {...props} theme="reasoning" />
);
