import type { TextProps } from "@snappy/ui";

import { useAgentFeedBadgeState } from "./AgentFeedBadge.state";
import { AgentFeedBadgeView } from "./AgentFeedBadge.view";

export type AgentFeedBadgeProps = TextProps & { finished: Promise<{ label: string }>; hideOnSuccess?: boolean };

export const AgentFeedBadge = (props: AgentFeedBadgeProps) => <AgentFeedBadgeView {...useAgentFeedBadgeState(props)} />;
