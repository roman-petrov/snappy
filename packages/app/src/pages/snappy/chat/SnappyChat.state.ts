import { _ } from "@snappy/core";
import { SnappyAgent } from "@snappy/snappy";
import { Language } from "@snappy/ui";
import { useRef, useState } from "react";

import type { AgentChatProps } from "../../../snappy/components";

export const useSnappyChatState = () => {
  const locale = Language.locale();
  const agentRef = useRef<SnappyAgent | undefined>(undefined);
  const [starterText, setStarterText] = useState<string | undefined>(undefined);
  const [splashDraft, setSplashDraft] = useState(``);
  const [sessionDraft, setSessionDraft] = useState(``);
  const started = starterText !== undefined;

  const splashSend = () => {
    setStarterText(splashDraft.trim());
    setSplashDraft(``);
  };

  const sessionSend = () => {
    const text = sessionDraft.trim();
    if (text === ``) {
      return;
    }
    agentRef.current?.appendUserText(text);
    setSessionDraft(``);
  };

  const chatProps: AgentChatProps = {
    runtime: ({ aiConfig, feed }) => {
      if (starterText === undefined) {
        return { run: _.noop, stop: _.noop };
      }
      const agent = SnappyAgent({ aiConfig, feed, locale });
      agentRef.current = agent;

      return {
        run: async () => agent.run(starterText),
        stop: () => {
          agent.stop();
          agentRef.current = undefined;
        },
      };
    },
    session: [locale, starterText],
    showFeed: started,
  };

  const composer = started
    ? { draft: sessionDraft, onSend: sessionSend, setDraft: setSessionDraft }
    : { draft: splashDraft, onSend: splashSend, setDraft: setSplashDraft };

  return { chatProps, composer, started };
};
