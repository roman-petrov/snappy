import { FeedStreamCard, type FeedStreamCardContentProps } from "../../FeedStreamCard";

export type AgentFeedMessageStreamProps = Omit<Extract<FeedStreamCardContentProps, { text?: never }>, `theme`>;

export const AgentFeedMessageStream = (props: AgentFeedMessageStreamProps) => (
  <FeedStreamCard {...props} theme="chat" />
);
