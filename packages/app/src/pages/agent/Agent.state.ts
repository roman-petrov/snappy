import { Agents } from "@snappy/snappy-presets";
import { Language } from "@snappy/ui";
import { useMemo } from "react";

import type { AgentChatProps } from "../../snappy/components";
import type { AgentProps } from "./Agent";

export const useAgentState = ({ agentId }: AgentProps) => {
  const locale = Language.locale();
  const resolved = useMemo(() => (agentId === `` ? undefined : Agents.byId(agentId, locale)), [agentId, locale]);

  const chatProps: AgentChatProps | undefined =
    resolved === undefined
      ? undefined
      : {
          runtime: ({ aiConfig, feed }) => {
            const runtime = resolved.module({ aiConfig, feed });

            return { run: async () => runtime.run(), stop: () => runtime.stop() };
          },
          session: [agentId, locale],
        };

  return { chatProps, title: resolved?.meta.title };
};
