import { Language } from "@snappy/ui";
import { useMemo } from "react";

import type { AgentChatProps } from "../../snappy/components";
import type { StaticChatProps } from "./StaticChat";

import { Catalog } from "../../catalog/registry";

export const useStaticChatState = ({ presetId }: StaticChatProps) => {
  const locale = Language.locale();
  const entry = useMemo(() => Catalog.byId(presetId, locale), [locale, presetId]);
  const agent = entry?.agent;

  const chatProps: AgentChatProps | undefined =
    agent === undefined
      ? undefined
      : {
          runtime: ({ aiConfig, feed }) => {
            const runtime = agent.module({ aiConfig, feed });

            return { run: async () => runtime.run(), stop: () => runtime.stop() };
          },
          session: [presetId, locale],
        };

  const pageTitle = agent === undefined ? undefined : `${agent.meta.emoji} ${agent.meta.title}`;

  return { agent, chatProps, pageTitle };
};
