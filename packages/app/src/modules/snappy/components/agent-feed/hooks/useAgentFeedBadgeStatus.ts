/* eslint-disable unicorn/try-complexity */
import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import type { AgentFeedBadgeLabel } from "../Types";

export type AgentFeedBadgeStatus = { status: `done` | `error` | `running`; text: string };

export type UseAgentFeedBadgeStatusInput = {
  done: PromiseWithResolvers<AgentFeedBadgeLabel>;
  hideOnSuccess?: boolean;
  text: string;
};

export const useAgentFeedBadgeStatus = ({ done, hideOnSuccess = false, text }: UseAgentFeedBadgeStatusInput) => {
  const [state, setState] = useState<AgentFeedBadgeStatus>({ status: `running`, text });

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

  const message = state.text;
  const { status } = state;

  return { hideOnSuccess, message, status };
};
