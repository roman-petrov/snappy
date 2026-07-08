import { _ } from "@snappy/core";
import { SnappyAgent } from "@snappy/snappy";
import { $, Language } from "@snappy/ui";
import { useEffect, useRef, useState } from "react";

import type { AgentChatProps } from "./agent-feed/AgentChat";
import type { SnappyFlowPageProps } from "./SnappyFlowPage";

import { AppTags } from "../../../AppTags";

export const useSnappyFlowPageState = ({ draft, presetId }: SnappyFlowPageProps) => {
  const locale = Language.locale();
  const setup = draft === undefined ? undefined : { skill: draft.skill, tools: draft.tools };
  const agentRef = useRef<SnappyAgent | undefined>(undefined);
  const [sentText, setSentText] = useState<string | undefined>(undefined);
  const [splashDraft, setSplashDraft] = useState(``);
  const [sessionDraft, setSessionDraft] = useState(``);
  const starterText = draft === undefined ? sentText : (sentText ?? draft.prompt[locale]);
  const started = starterText !== undefined;
  const [showFeed, setShowFeed] = useState(false);

  useEffect(() => {
    setShowFeed(started);
  }, [presetId, started]);

  const runText = showFeed ? starterText : undefined;

  const splashSend = () => {
    const text = splashDraft.trim();
    if (text === ``) {
      return;
    }
    $.track(AppTags.snappy.message.send, { presetId: presetId ?? `` });
    setSentText(text);
    setSplashDraft(``);
  };

  const sessionSend = () => {
    const text = sessionDraft.trim();
    if (text === ``) {
      return;
    }
    $.track(AppTags.snappy.message.send, { presetId: presetId ?? `` });
    agentRef.current?.appendUserText(text);
    setSessionDraft(``);
  };

  const chatProps: AgentChatProps = {
    runtime: ({ aiConfig, feed }) => {
      if (runText === undefined) {
        return { run: _.noop, stop: _.noop };
      }

      const agent = SnappyAgent({ aiConfig, feed, locale, setup });
      agentRef.current = agent;

      return {
        run: async () => agent.run(runText),
        stop: () => {
          agent.stop();
          agentRef.current = undefined;
        },
      };
    },
    session: [locale, presetId ?? ``, runText],
    showFeed,
  };

  const composer = started
    ? { draft: sessionDraft, onSend: sessionSend, setDraft: setSessionDraft }
    : { draft: splashDraft, onSend: splashSend, setDraft: setSplashDraft };

  const title = draft === undefined ? undefined : { emoji: draft.meta.emoji, title: draft.meta.title[locale] };

  return { chatProps, composer, started, title };
};
