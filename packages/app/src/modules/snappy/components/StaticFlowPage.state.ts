import { Bilingual } from "@snappy/intl";
import { Language } from "@snappy/ui";
import { useMemo } from "react";

import type { AgentChatProps } from "./agent-feed/AgentChat";
import type { StaticFlowPageProps } from "./StaticFlowPage";

export const useStaticFlowPageState = ({ agent, meta, presetId }: StaticFlowPageProps) => {
  const locale = Language.locale();
  const resolved = useMemo(() => agent(locale), [agent, locale]);

  const chatProps: AgentChatProps = {
    runtime: ({ aiConfig, feed }) => {
      const runtime = resolved.module({ aiConfig, feed });

      return { run: async () => runtime.run(), stop: () => runtime.stop() };
    },
    session: [presetId, locale],
  };

  const title = { emoji: meta.emoji, title: Bilingual.pick(locale, meta.title) };

  return { chatProps, title };
};
