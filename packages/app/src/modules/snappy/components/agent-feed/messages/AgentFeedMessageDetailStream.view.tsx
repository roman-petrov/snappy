import { Spinner, Spoiler } from "@snappy/ui";

import type { useAgentFeedMessageDetailStreamState } from "./AgentFeedMessageDetailStream.state";

import { FeedStreamCard } from "../../../../../components";

export type AgentFeedMessageDetailStreamViewProps = ReturnType<typeof useAgentFeedMessageDetailStreamState>;

export const AgentFeedMessageDetailStreamView = ({
  color,
  mark,
  message,
  onComplete,
  running,
  stream,
}: AgentFeedMessageDetailStreamViewProps) => (
  <Spoiler color={color} left={running ? <Spinner /> : mark} summary={message}>
    <FeedStreamCard onComplete={onComplete} stream={stream} theme="reasoning" />
  </Spoiler>
);
