import type { TypeWriterSpeed } from "@snappy/domain";
import type { AgentAiConfig } from "@snappy/snappy-sdk";

import { useRouterGo } from "@snappy/app-router";
import { _ } from "@snappy/core";
import { useAsyncEffect } from "@snappy/ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { FeedArtifact } from "../../snappy/components/Types";

import { AgentAiFromSettings, trpc } from "../../core";
import { Routes } from "../../Routes";

export const useFeedState = () => {
  const [items, setItems] = useState<FeedArtifact[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [aiConfig, setAiConfig] = useState<AgentAiConfig | undefined>(undefined);
  const [typeWriterSpeed, setTypeWriterSpeed] = useState<TypeWriterSpeed | undefined>(undefined);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useAsyncEffect(async () => {
    const [settings, page] = await Promise.all([trpc.user.settings.get.query(), trpc.feed.list.query({ limit: 20 })]);

    setAiConfig(AgentAiFromSettings(settings));
    setTypeWriterSpeed(settings.typeWriterSpeed);
    setItems(page.items);
    setCursor(page.nextCursor);
    setHasMore(page.nextCursor !== undefined);
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;

    if (node === null || !hasMore || items.length === 0) {
      return _.noop;
    }

    let loading = false;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting !== true || loading) {
        return;
      }

      loading = true;
      void (async () => {
        try {
          const page = await trpc.feed.list.query({ cursor, limit: 20 });

          setItems(previous => [...previous, ...page.items]);
          setCursor(page.nextCursor);
          setHasMore(page.nextCursor !== undefined);
        } finally {
          loading = false;
        }
      })();
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [cursor, hasMore, items.length]);

  const go = useRouterGo();

  const onPublish = useCallback((artifact: FeedArtifact) => {
    setItems(previous => previous.map(item => (item.id === artifact.id ? artifact : item)));
  }, []);

  const removeItem = useCallback((artifactId: string) => {
    setItems(previous => previous.filter(item => item.id !== artifactId));
  }, []);

  const onError = useCallback(
    async (_artifactId: string, error: unknown) => {
      if (_.isObject(error) && (error as { error?: { status?: unknown } }).error?.status === `balanceBlocked`) {
        return go(Routes.settings.profile.topUp, { replace: true });
      }

      return undefined;
    },
    [go],
  );

  const cards = useMemo(
    () =>
      aiConfig === undefined
        ? undefined
        : items.map(item => {
            const bindings = {
              id: item.id,
              onError,
              onPublish,
              onRemove: () => removeItem(item.id),
              prompt: item.generationPrompt,
            };

            return item.type === `image`
              ? { ...bindings, content: item.src, model: aiConfig.models.image, type: `image` as const }
              : {
                  ...bindings,
                  content: item.text,
                  model: aiConfig.models.chat,
                  type: `text` as const,
                  typeWriterSpeed,
                };
          }),
    [aiConfig, items, onError, onPublish, removeItem, typeWriterSpeed],
  );

  return { cards, sentinelRef };
};
