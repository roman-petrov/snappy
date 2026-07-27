import type { AgentFeedMessageDetailStreamProps } from "./AgentFeedMessageDetailStream";

import { useAgentFeedBadgeStatus } from "../hooks";

export const useAgentFeedMessageDetailStreamState = ({ done, text, ...rest }: AgentFeedMessageDetailStreamProps) => {
  const colors = { done: `success`, error: `error`, running: `primary` } as const;
  const marks = { done: `✅`, error: `❌`, running: undefined } as const;
  const { message, status } = useAgentFeedBadgeStatus({ done, text });
  const color = colors[status];
  const mark = marks[status];
  const running = status === `running`;

  return { color, mark, message, running, ...rest };
};
