import type { AgentAiConfig } from "@snappy/snappy-sdk";

import { _ } from "@snappy/core";
import { useAsyncEffect, useGo } from "@snappy/ui";
import { createElement, useEffect, useRef, useState } from "react";

import type { AgentChatProps, AgentChatRuntime } from "./AgentChat";
import type { AgentFeedHandle } from "./AgentFeedHandle";

import { AgentAiFromSettings, trpc } from "../../../core";
import { Routes } from "../../../Routes";
import { AgentFeed } from "./AgentFeed";

export const useAgentChatState = ({ runtime, session = [], showFeed = true }: AgentChatProps) => {
  const go = useGo();
  const feedRef = useRef<AgentFeedHandle>(null);
  const runtimeRef = useRef<AgentChatRuntime | undefined>(undefined);
  const runtimeFn = useRef(runtime);
  runtimeFn.current = runtime;
  const [phase, setPhase] = useState<`blocked` | `booting` | `ready`>(`booting`);
  const [aiConfig, setAiConfig] = useState<AgentAiConfig | undefined>(undefined);
  const sessionKey = session.map(token => token ?? ``).join(`\u0000`);

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
    if (phase !== `ready` || aiConfig === undefined) {
      return _.noop;
    }
    const handle = feedRef.current;
    if (handle === null) {
      return _.noop;
    }
    const instance = runtimeFn.current({ aiConfig, feed: handle });
    runtimeRef.current = instance;
    void instance.run();

    return () => {
      instance.stop();
      runtimeRef.current = undefined;
    };
  }, [aiConfig, phase, sessionKey]);

  const stop = async () => {
    runtimeRef.current?.stop();
    await go(Routes.home);
  };

  const ready = phase === `ready` && aiConfig !== undefined;
  const balanceLow = phase === `blocked`;
  const feed = ready ? createElement(AgentFeed, { ref: feedRef }) : undefined;

  return { balanceLow, feed, showFeed, stop };
};
