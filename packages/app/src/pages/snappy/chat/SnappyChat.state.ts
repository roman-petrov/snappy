import { _ } from "@snappy/core";
import { SnappyAgent } from "@snappy/snappy";
import { Language } from "@snappy/ui";
import { useEffect, useMemo, useRef, useState } from "react";

import type { AgentChatProps } from "../../../snappy/components";
import type { SnappyChatProps } from "./SnappyChat";

import { Catalog } from "../../../catalog/registry";

export const SnappyChatBlankPresetId = `_` as const;

export const useSnappyChatState = ({ presetId }: SnappyChatProps) => {
  const locale = Language.locale();
  const isBlank = presetId === SnappyChatBlankPresetId;

  const preset = useMemo(
    () => (presetId === SnappyChatBlankPresetId ? undefined : Catalog.byId(presetId, locale)?.preset),
    [locale, presetId],
  );

  const invalidPreset = !isBlank && preset === undefined;
  const agentRef = useRef<SnappyAgent | undefined>(undefined);
  const [sentText, setSentText] = useState<string | undefined>(undefined);
  const [splashDraft, setSplashDraft] = useState(``);
  const [sessionDraft, setSessionDraft] = useState(``);
  const starterText = preset?.prompt[locale] ?? sentText;
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
    setSentText(text);
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
      if (runText === undefined) {
        return { run: _.noop, stop: _.noop };
      }
      const agent = SnappyAgent({ aiConfig, feed, locale, preset });
      agentRef.current = agent;

      return {
        run: async () => agent.run(runText),
        stop: () => {
          agent.stop();
          agentRef.current = undefined;
        },
      };
    },
    session: [locale, presetId, runText],
    showFeed,
  };

  const composer = started
    ? { draft: sessionDraft, onSend: sessionSend, setDraft: setSessionDraft }
    : { draft: splashDraft, onSend: splashSend, setDraft: setSplashDraft };

  const pageTitle = preset === undefined ? undefined : `${preset.meta.emoji} ${preset.meta.title[locale]}`;

  return { chatProps, composer, invalidPreset, pageTitle, started };
};
