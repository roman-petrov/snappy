import type { AgentAiConfig, AgentFeedRuntime, StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy-sdk";

import { _ } from "@snappy/core";
import { SnappyAgent } from "@snappy/snappy";
import { Language, useAsyncEffect, useGo } from "@snappy/ui";
import { createElement, useEffect, useRef, useState } from "react";

import type { AgentFeedHandle } from "./components/agent-feed/Types";

import { AgentAiFromSettings, trpc } from "../core";
import { ChatFeed } from "../pages/feed/ChatFeed";
import { Routes } from "../Routes";
import { AgentFeed, agentFeedRuntime } from "./components";

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
  const stopRef = useRef<(() => void) | undefined>(undefined);
  const askResolveRef = useRef<((value: StaticFormAnswersOf<StaticFormPlan>) => void) | undefined>(undefined);
  const appendToAgentRef = useRef<(text: string) => void>(() => {});

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
    const feed: AgentFeedRuntime = agentFeedRuntime({ askResolveRef, getHandle: () => feedRef.current });
    const runtime = SnappyAgent({ aiConfig, feed, locale });
    stopRef.current = runtime.stop;
    appendToAgentRef.current = () => {};
    void runtime.run(starterText, fn => {
      appendToAgentRef.current = fn;
    });

    return () => {
      runtime.stop();
      stopRef.current = undefined;
      askResolveRef.current = undefined;
      appendToAgentRef.current = () => {};
    };
  }, [aiConfig, locale, phase, starterText]);

  const onStop = async () => {
    stopRef.current?.();
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
    appendToAgentRef.current(text);
    setSessionDraft(``);
  };

  const conductorReady = phase === `ready` && aiConfig !== undefined;
  const balanceLow = phase === `blocked`;

  const desk =
    conductorReady && starterText !== undefined
      ? {
          draft: sessionDraft,
          feed: createElement(AgentFeed, {
            artifactSink: {
              publish: async artifact => {
                await ChatFeed.append([
                  artifact.type === `text`
                    ? { generationPrompt: artifact.generationPrompt, html: artifact.html, type: `text` }
                    : { generationPrompt: artifact.generationPrompt, src: artifact.src, type: `image` },
                ]);
              },
            },
            onFormSubmit: value => {
              askResolveRef.current?.(value);
              askResolveRef.current = undefined;
            },
            ref: feedRef,
          }),
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
