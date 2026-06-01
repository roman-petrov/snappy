import { Chip, Spinner } from "@snappy/ui";

import type { useAgentFeedMessageBadgeState } from "./AgentFeedMessageBadge.state";

export type AgentFeedMessageBadgeViewProps = ReturnType<typeof useAgentFeedMessageBadgeState>;

export const AgentFeedMessageBadgeView = ({ hideOnSuccess, message, status }: AgentFeedMessageBadgeViewProps) =>
  hideOnSuccess && status === `done` ? undefined : (
    <Chip
      color={status === `running` ? `primary` : status === `done` ? `success` : `error`}
      left={status === `running` ? <Spinner /> : undefined}
      text={status === `done` ? `✅ ${message}` : status === `error` ? `❌ ${message}` : message}
    />
  );
