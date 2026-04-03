import { useEffect, useRef, useState } from "react";

import type { AgentChatProps } from "./AgentChat";

export const useAgentChatState = ({ form, surface }: AgentChatProps) => {
  const { error, feedItems, sessionSteps } = surface;
  const [finishedById, setFinishedById] = useState<Record<string, boolean>>({});
  const activeRef = useRef(true);

  useEffect(() => {
    setFinishedById({});
    activeRef.current = true;

    for (const { done, id } of sessionSteps) {
      void done.then(() => {
        if (activeRef.current) {
          setFinishedById(previous => ({ ...previous, [id]: true }));
        }

        return undefined;
      });
    }

    return () => {
      activeRef.current = false;
    };
  }, [sessionSteps]);

  const sessionStepFinished = (id: string) => finishedById[id] === true;

  return { error, feedItems, form, sessionStepFinished, sessionSteps };
};
