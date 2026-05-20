import type { AgentAiConfig } from "@snappy/snappy-sdk";

import { Ai, type Ai as AiClient } from "@snappy/ai";
import { _ } from "@snappy/core";
import { useAsyncEffect, useGo } from "@snappy/ui";
import { useCallback, useMemo, useState } from "react";

import { AgentAiFromSettings, trpc } from "../../core";
import { Routes } from "../../Routes";
import { ChatFeed, type FeedArtifact } from "./ChatFeed";

export const useFeedState = () => {
  const [artifacts, setArtifacts] = useState<FeedArtifact[]>([]);
  const [aiConfig, setAiConfig] = useState<AgentAiConfig | undefined>(undefined);
  const [ai, setAi] = useState<AiClient | undefined>(undefined);

  const refresh = useCallback(async () => {
    setArtifacts(await ChatFeed.read());
  }, []);

  useAsyncEffect(async () => {
    await refresh();
  }, [refresh]);

  useAsyncEffect(async () => {
    const config = AgentAiFromSettings(await trpc.user.settings.get.query());
    setAiConfig(config);
    setAi(Ai(config.options));
  }, []);

  const go = useGo();

  const onPublish = useCallback(() => {
    void refresh();
  }, [refresh]);

  const onRemove = useCallback(() => {
    void refresh();
  }, [refresh]);

  const onError = useCallback(
    async (_artifactId: string, error: unknown) => {
      if (_.isObject(error) && (error as { error?: { status?: unknown } }).error?.status === `balanceBlocked`) {
        return go(Routes.balance.topUp, { replace: true });
      }

      return undefined;
    },
    [go],
  );

  const cards = useMemo(
    () =>
      ai === undefined || aiConfig === undefined
        ? undefined
        : artifacts.map(item => {
            const shared = { ai, id: item.id, onError, onPublish, onRemove, prompt: item.generationPrompt };

            return item.type === `image`
              ? { ...shared, content: item.src, model: aiConfig.models.image, type: `image` }
              : { ...shared, content: item.text, model: aiConfig.models.chat, type: `text` };
          }),
    [ai, aiConfig, artifacts, onError, onPublish, onRemove],
  );

  return { cards };
};
