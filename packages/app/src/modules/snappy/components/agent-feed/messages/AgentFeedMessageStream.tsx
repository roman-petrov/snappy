import type { TypeWriterSpeed } from "@snappy/domain";

import { FeedStreamCard } from "../../../../../components";

export type AgentFeedMessageStreamProps = {
  onComplete?: (text: string) => void;
  stream: AsyncIterable<string>;
  typeWriterSpeed?: TypeWriterSpeed;
};

export const AgentFeedMessageStream = (props: AgentFeedMessageStreamProps) => (
  <FeedStreamCard {...props} theme="chat" />
);
