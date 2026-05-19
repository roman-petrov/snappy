import { useEffect, useState } from "react";

import type { AgentFeedMessageBadgeProps } from "./AgentFeedMessageBadge";

export type AgentFeedMessageBadgeState = { status: `done` | `error` | `running`; text: string };

export const useAgentFeedMessageBadgeState = ({
  finished,
  hideOnSuccess = false,
  text,
  ...textProps
}: AgentFeedMessageBadgeProps) => {
  const [state, setState] = useState<AgentFeedMessageBadgeState>({ status: `running`, text });

  useEffect(() => {
    let mounted = true;

    void finished
      .then((value: { label: string }) => {
        if (!mounted) {
          return undefined;
        }

        if (hideOnSuccess) {
          setState({ status: `done`, text: `` });
        } else {
          setState({ status: `done`, text: value.label.trim() === `` ? text : value.label });
        }

        return undefined;
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setState(current => ({ ...current, status: `error` }));
      });

    return () => {
      mounted = false;
    };
  }, [finished, hideOnSuccess, text]);

  return { hideOnSuccess, message: state.text, status: state.status, textProps };
};
