import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import type { AgentFeedMessageBadgeProps } from "./AgentFeedMessageBadge";

export type AgentFeedMessageBadgeState = { status: `done` | `error` | `running`; text: string };

export const useAgentFeedMessageBadgeState = ({ done, hideOnSuccess = false, text }: AgentFeedMessageBadgeProps) => {
  const [state, setState] = useState<AgentFeedMessageBadgeState>({ status: `running`, text });

  useAsyncEffect(async () => {
    setState({ status: `running`, text });

    try {
      const value = await done.promise;

      setState(
        hideOnSuccess
          ? { status: `done`, text: `` }
          : { status: `done`, text: value.label.trim() === `` ? text : value.label },
      );
    } catch {
      setState(current => ({ ...current, status: `error` }));
    }
  }, [done, hideOnSuccess, text]);

  return { hideOnSuccess, message: state.text, status: state.status };
};
