import type { AgentAiConfig } from "@snappy/snappy-sdk";

import { Ai, type Ai as AiClient } from "@snappy/ai";
import { _ } from "@snappy/core";
import { useAsyncEffect, useGo } from "@snappy/ui";
import { useState } from "react";

import { AgentAiFromSettings, trpc } from "../../core";
import { Routes } from "../../Routes";
import { ChatFeed, type FeedArtifact } from "./ChatFeed";

type FeedImageCard = {
  id: string;
  kind: `image`;
  onDelete: () => void;
  onError: (error: unknown) => void;
  onGenerated: (next: string) => void;
  prompt: string;
  src: string;
};

type FeedTextCard = {
  html: string;
  id: string;
  kind: `text`;
  onDelete: () => void;
  onError: (error: unknown) => void;
  onGenerated: (next: string) => void;
  prompt: string;
};

export const useFeedState = () => {
  const go = useGo();
  const [artifacts, setArtifacts] = useState<FeedArtifact[]>([]);
  const [aiConfig, setAiConfig] = useState<AgentAiConfig | undefined>(undefined);
  const [ai, setAi] = useState<AiClient | undefined>(undefined);

  const isBalanceBlockedError = (error: unknown): boolean => {
    if (!_.isObject(error)) {
      return false;
    }
    const nestedError = (error as { error?: { status?: unknown } }).error;

    return nestedError?.status === `balanceBlocked`;
  };

  useAsyncEffect(async () => {
    setArtifacts(await ChatFeed.read());
  }, []);

  useAsyncEffect(async () => {
    const config = AgentAiFromSettings(await trpc.user.settings.get.query());
    setAiConfig(config);
    setAi(Ai(config.options));
  }, []);

  const onGenerationError = (error: unknown) => {
    if (isBalanceBlockedError(error)) {
      void go(Routes.balance.topUp, { replace: true });
    }
  };

  const onDeleteArtifact = (id: string) => {
    void ChatFeed.remove(id).then(setArtifacts);
  };

  const onImageGenerated = async (id: string, src: string) => {
    setArtifacts(await ChatFeed.patch(id, { src }));
  };

  const onTextGenerated = async (id: string, html: string) => {
    setArtifacts(await ChatFeed.patch(id, { html }));
  };

  const cards: (FeedImageCard | FeedTextCard)[] = artifacts.map(item =>
    item.type === `image`
      ? {
          id: item.id,
          kind: `image`,
          onDelete: () => onDeleteArtifact(item.id),
          onError: onGenerationError,
          onGenerated: async (next: string) => onImageGenerated(item.id, next),
          prompt: item.generationPrompt,
          src: item.src,
        }
      : {
          html: item.html,
          id: item.id,
          kind: `text`,
          onDelete: () => onDeleteArtifact(item.id),
          onError: onGenerationError,
          onGenerated: async (next: string) => onTextGenerated(item.id, next),
          prompt: item.generationPrompt,
        },
  );

  return { ai, aiConfig, cards };
};
