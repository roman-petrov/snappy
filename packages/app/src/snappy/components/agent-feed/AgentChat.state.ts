import type { AgentAiConfig } from "@snappy/snappy-sdk";

import { _, Unicode } from "@snappy/core";
import { useAsyncEffect } from "@snappy/ui";
import { createElement, useEffect, useRef, useState } from "react";

import type { AgentChatProps } from "./AgentChat";
import type { AgentFeedHandle } from "./AgentFeedHandle";

import { AgentAiFromSettings, trpc, type UserSettings } from "../../../core";
import { AgentFeed } from "./AgentFeed";

export const useAgentChatState = ({ runtime, session = [], showFeed = true }: AgentChatProps) => {
  const feedRef = useRef<AgentFeedHandle>(null);
  const runtimeFn = useRef(runtime);
  runtimeFn.current = runtime;
  const aiConfigRef = useRef<AgentAiConfig | undefined>(undefined);
  const gated = useRef(!showFeed).current;
  const [phase, setPhase] = useState<`blocked` | `booting` | `ready`>(gated ? `booting` : `ready`);
  const [aiConfig, setAiConfig] = useState<AgentAiConfig | undefined>(undefined);
  const [typeWriterSpeed, setTypeWriterSpeed] = useState<UserSettings[`typeWriterSpeed`]>(undefined);
  const sessionKey = session.map(token => token ?? ``).join(Unicode.null);

  const aiConfigLazy = useRef({
    get models() {
      if (aiConfigRef.current === undefined) {
        throw new Error(`settings not loaded`);
      }

      return aiConfigRef.current.models;
    },
  }).current;

  useAsyncEffect(async () => {
    if (gated) {
      setPhase(`booting`);
    }
    const [balance, settings] = await Promise.all([trpc.user.balance.query(), trpc.user.settings.get.query()]);
    aiConfigRef.current = AgentAiFromSettings(settings);
    setAiConfig(aiConfigRef.current);
    setTypeWriterSpeed(settings.typeWriterSpeed);
    if (gated && !(settings.aiTunnelDirect && settings.aiTunnelKey.trim() !== ``) && balance <= 0) {
      setPhase(`blocked`);

      return;
    }
    setPhase(`ready`);
  }, [gated]);

  const ready = phase === `ready` && (!gated || aiConfig !== undefined);
  const balanceLow = gated && phase === `blocked`;
  const boot = gated ? aiConfig : undefined;

  useEffect(() => {
    if (!ready) {
      return _.noop;
    }
    const handle = feedRef.current;
    if (handle === null) {
      return _.noop;
    }
    const resolved = gated ? boot : aiConfigLazy;
    if (resolved === undefined) {
      return _.noop;
    }
    const instance = runtimeFn.current({ aiConfig: resolved, feed: handle });
    void instance.run();

    return () => {
      instance.stop();
      handle.reset();
    };
  }, [aiConfigLazy, boot, gated, phase, ready, sessionKey]);

  const feed = (gated ? ready : showFeed) ? createElement(AgentFeed, { ref: feedRef, typeWriterSpeed }) : undefined;

  return { balanceLow, feed, showFeed };
};
