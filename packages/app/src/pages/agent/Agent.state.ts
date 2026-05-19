import type { AgentAiConfig } from "@snappy/snappy-sdk";

import { _ } from "@snappy/core";
import { Agents } from "@snappy/snappy-presets";
import { Language, useAsyncEffect, useGo } from "@snappy/ui";
import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { AgentAiFromSettings, trpc } from "../../core";
import { Routes } from "../../Routes";
import { AgentFeed, type AgentFeedHandle } from "../../snappy/components";
import { ChatFeed } from "../feed/ChatFeed";

type ChatPhase = `blocked` | `booting` | `ready`;

export const useAgentState = () => {
  const parameters = useParams();
  const agentId = (parameters[`agentId`] ?? ``).trim();
  const locale = Language.locale();
  const go = useGo();
  const resolved = useMemo(() => (agentId === `` ? undefined : Agents.byId(agentId, locale)), [agentId, locale]);
  const [phase, setPhase] = useState<ChatPhase>(`booting`);
  const [aiConfig, setAiConfig] = useState<AgentAiConfig | undefined>(undefined);
  const feedRef = useRef<AgentFeedHandle>(null);
  const stopRef = useRef<(() => void) | undefined>(undefined);

  useAsyncEffect(async () => {
    if (resolved === undefined) {
      return;
    }
    setPhase(`booting`);
    const [balance, settings] = await Promise.all([trpc.user.balance.query(), trpc.user.settings.get.query()]);
    setAiConfig(AgentAiFromSettings(settings));
    const billViaProxy = !(settings.aiTunnelDirect && settings.aiTunnelKey.trim() !== ``);
    if (billViaProxy && balance <= 0) {
      setPhase(`blocked`);

      return;
    }
    setPhase(`ready`);
  }, [resolved]);

  useEffect(() => {
    if (phase !== `ready` || aiConfig === undefined || resolved === undefined) {
      return _.noop;
    }
    const handle = feedRef.current;
    if (handle === null) {
      return _.noop;
    }
    const runtime = resolved.module({ aiConfig, feed: handle });
    stopRef.current = runtime.stop;
    void runtime.run();

    return () => {
      runtime.stop();
      stopRef.current = undefined;
    };
  }, [aiConfig, phase, resolved]);

  const onStop = async () => {
    stopRef.current?.();
    await go(Routes.home);
  };

  const title = resolved?.meta.title;
  const balanceLow = resolved !== undefined && phase === `blocked`;
  const ready = resolved !== undefined && phase === `ready` && aiConfig !== undefined;

  const screen = ready
    ? createElement(AgentFeed, {
        artifactSink: {
          publish: async artifact => {
            await ChatFeed.append([
              artifact.type === `text`
                ? { generationPrompt: artifact.generationPrompt, html: artifact.html, type: `text` }
                : { generationPrompt: artifact.generationPrompt, src: artifact.src, type: `image` },
            ]);
          },
        },
        ref: feedRef,
      })
    : undefined;

  return { balanceLow, onStop, screen, title };
};
