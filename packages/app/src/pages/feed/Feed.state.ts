import { type AgentAiConfig, Agents } from "@snappy/agents";
import { _ } from "@snappy/core";
import { Locale, useAsyncEffect, useGo } from "@snappy/ui";
import { useCallback, useEffect, useMemo, useState } from "react";

import { agentAiFromSettings, trpc } from "../../core";
import { Routes } from "../../Routes";
import { ChatFeed, type FeedArtifact, type RegenerateArtifactInput } from "./ChatFeed";

export const useFeedState = () => {
  const go = useGo();
  const chatFeed = useMemo(() => ChatFeed(), []);
  const [artifacts, setArtifacts] = useState<FeedArtifact[]>([]);
  const [regeneratingMessageIds, setRegeneratingMessageIds] = useState(new Set<string>());
  const [aiConfig, setAiConfig] = useState<AgentAiConfig | undefined>(undefined);

  const isBalanceBlockedError = useCallback((error: unknown): boolean => {
    if (!_.isObject(error)) {
      return false;
    }
    const nestedError = (error as { error?: { status?: unknown } }).error;

    return nestedError?.status === `balanceBlocked`;
  }, []);

  useEffect(() => chatFeed.subscribe(setArtifacts), [chatFeed]);

  useAsyncEffect(async () => {
    const settings = await trpc.user.settings.get.query();
    setAiConfig(agentAiFromSettings(settings));
  }, []);

  const setRegenerating = useCallback((id: string, on: boolean) => {
    setRegeneratingMessageIds(previous => {
      const next = new Set(previous);
      if (on) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  }, []);

  const regenerateArtifact = useCallback(
    async ({ kind, messageId }: RegenerateArtifactInput) => {
      if (aiConfig === undefined) {
        return;
      }
      const candidate = chatFeed.list().find(item => item.id === messageId);
      if (candidate?.type !== kind) {
        return;
      }
      setRegenerating(messageId, true);
      try {
        try {
          const definition = Agents.byId(candidate.agentId, Locale.effective());
          if (definition === undefined) {
            return;
          }
          const patch = await definition.headless.regenerate({
            aiConfig,
            artifact: candidate,
            locale: Locale.effective(),
          });
          await chatFeed.patchArtifact(messageId, patch);
        } catch (error) {
          if (isBalanceBlockedError(error)) {
            void go(Routes.balance.low, { replace: true });

            return;
          }
          throw error;
        }
      } finally {
        setRegenerating(messageId, false);
      }
    },
    [aiConfig, chatFeed, go, isBalanceBlockedError, setRegenerating],
  );

  return {
    artifacts,
    onRemoveArtifact: (id: string) => {
      void chatFeed.removeArtifact(id);
    },
    regenerateArtifact,
    regeneratingMessageIds,
  };
};
