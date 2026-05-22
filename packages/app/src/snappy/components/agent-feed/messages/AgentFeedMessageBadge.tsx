import type { TextProps } from "@snappy/ui";

import { useAgentFeedMessageBadgeState } from "./AgentFeedMessageBadge.state";
import { AgentFeedMessageBadgeView } from "./AgentFeedMessageBadge.view";

export type AgentFeedMessageBadgeProps = TextProps & {
  done: PromiseWithResolvers<{ label: string }>;
  hideOnSuccess?: boolean;
};

export const AgentFeedMessageBadge = (props: AgentFeedMessageBadgeProps) => (
  <AgentFeedMessageBadgeView {...useAgentFeedMessageBadgeState(props)} />
);
