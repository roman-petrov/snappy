import type { AgentAiConfig } from "@snappy/snappy-sdk";

import { _ } from "@snappy/core";
import { SnappyAgent } from "@snappy/snappy";
import { Language, useAsyncEffect, useGo } from "@snappy/ui";
import { createElement, useEffect, useRef, useState } from "react";

import { AgentAiFromSettings, trpc } from "../core";
import { AgentFeedArtifactSink } from "../pages/feed";
import { Routes } from "../Routes";
import { AgentFeed, type AgentFeedHandle } from "./components";

type ChatPhase = `blocked` | `booting` | `ready`;

export const useSnappyState = () => {
  const locale = Language.locale();
  const go = useGo();
  const [phase, setPhase] = useState<ChatPhase>(`booting`);
  const [aiConfig, setAiConfig] = useState<AgentAiConfig | undefined>(undefined);
  const [starterText, setStarterText] = useState<string | undefined>(undefined);
  const [splashDraft, setSplashDraft] = useState(``);
  const [sessionDraft, setSessionDraft] = useState(``);
  const feedRef = useRef<AgentFeedHandle>(null);
  const agentRef = useRef<SnappyAgent | undefined>(undefined);

  useAsyncEffect(async () => {
    setPhase(`booting`);
    const [balance, settings] = await Promise.all([trpc.user.balance.query(), trpc.user.settings.get.query()]);
    setAiConfig(AgentAiFromSettings(settings));
    const billViaProxy = !(settings.aiTunnelDirect && settings.aiTunnelKey.trim() !== ``);
    if (billViaProxy && balance <= 0) {
      setPhase(`blocked`);

      return;
    }
    setPhase(`ready`);
  }, []);

  useEffect(() => {
    if (phase !== `ready` || aiConfig === undefined || starterText === undefined) {
      return _.noop;
    }
    const handle = feedRef.current;
    if (handle === null) {
      return _.noop;
    }
    const runtime = SnappyAgent({ aiConfig, feed: handle, locale });
    agentRef.current = runtime;
    void runtime.run(starterText);

    return () => {
      runtime.stop();
      agentRef.current = undefined;
    };
  }, [aiConfig, locale, phase, starterText]);

  const onStop = async () => {
    agentRef.current?.stop();
    await go(Routes.home);
  };

  const splashSend = () => {
    const text = splashDraft.trim();
    if (text === ``) {
      return;
    }
    setStarterText(text);
    setSplashDraft(``);
  };

  const sessionSend = () => {
    const text = sessionDraft.trim();
    if (text === ``) {
      return;
    }
    feedRef.current?.appendUserText(text);
    agentRef.current?.appendUserText(text);
    setSessionDraft(``);
  };

  const conductorReady = phase === `ready` && aiConfig !== undefined;
  const balanceLow = phase === `blocked`;

  const desk =
    conductorReady && starterText !== undefined
      ? {
          draft: sessionDraft,
          feed: createElement(AgentFeed, { artifactSink: AgentFeedArtifactSink(), ref: feedRef }),
          onSend: sessionSend,
          setDraft: setSessionDraft,
        }
      : undefined;

  const splash =
    conductorReady && starterText === undefined
      ? { draft: splashDraft, onSend: splashSend, setDraft: setSplashDraft }
      : undefined;

  return { balanceLow, desk, onStop, splash };
};
