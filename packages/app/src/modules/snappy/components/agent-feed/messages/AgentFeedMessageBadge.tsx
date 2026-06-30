import { useAgentFeedMessageBadgeState } from "./AgentFeedMessageBadge.state";
import { AgentFeedMessageBadgeView } from "./AgentFeedMessageBadge.view";

export type AgentFeedMessageBadgeProps = {
  done: PromiseWithResolvers<{ label: string }>;
  hideOnSuccess?: boolean;
  text: string;
};

export const AgentFeedMessageBadge = (props: AgentFeedMessageBadgeProps) => (
  <AgentFeedMessageBadgeView {...useAgentFeedMessageBadgeState(props)} />
);
