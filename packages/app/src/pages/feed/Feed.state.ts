import type { AgentAiConfig } from "@snappy/snappy-sdk";

import { Ai, type Ai as AiClient } from "@snappy/ai";
import { _ } from "@snappy/core";
import { useAsyncEffect, useGo } from "@snappy/ui";
import { useState } from "react";

import { AgentAiFromSettings, trpc } from "../../core";
import { Routes } from "../../Routes";
import { ChatFeed, type FeedArtifact } from "./ChatFeed";

export const useFeedState = () => {
  const go = useGo();
  const [artifacts, setArtifacts] = useState<FeedArtifact[]>([]);
  const [aiConfig, setAiConfig] = useState<AgentAiConfig | undefined>(undefined);
  const [ai, setAi] = useState<AiClient | undefined>(undefined);

  useAsyncEffect(async () => {
    setArtifacts(await ChatFeed.read());
  }, []);

  useAsyncEffect(async () => {
    const config = AgentAiFromSettings(await trpc.user.settings.get.query());
    setAiConfig(config);
    setAi(Ai(config.options));
  }, []);

  const cards = artifacts.map(({ generationPrompt, ...item }) => ({
    ...item,
    onDelete: async () => setArtifacts(await ChatFeed.remove(item.id)),
    onError: (error: unknown) => {
      if (_.isObject(error) && (error as { error?: { status?: unknown } }).error?.status === `balanceBlocked`) {
        void go(Routes.balance.topUp, { replace: true });
      }
    },
    onGenerated: async (next: string) =>
      setArtifacts(await ChatFeed.patch(item.id, item.type === `image` ? { src: next } : { text: next })),
    prompt: generationPrompt,
  }));

  return { ai, aiConfig, cards };
};
