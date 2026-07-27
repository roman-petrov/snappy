import type { AgentFeedBadgeLabel } from "../Types";

import { useAgentFeedMessageDetailStreamState } from "./AgentFeedMessageDetailStream.state";
import { AgentFeedMessageDetailStreamView } from "./AgentFeedMessageDetailStream.view";

export type AgentFeedMessageDetailStreamProps = {
  done: PromiseWithResolvers<AgentFeedBadgeLabel>;
  onComplete?: (text: string) => void;
  stream: AsyncIterable<string>;
  text: string;
};

export const AgentFeedMessageDetailStream = (props: AgentFeedMessageDetailStreamProps) => (
  <AgentFeedMessageDetailStreamView {...useAgentFeedMessageDetailStreamState(props)} />
);
