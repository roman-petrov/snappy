import type { TypeWriterSpeed } from "@snappy/domain";
import type { AgentAiConfig } from "@snappy/snappy-sdk";

import { _ } from "@snappy/core";
import { useAsyncEffect, useGo } from "@snappy/ui";
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
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);

    try {
      const page = await trpc.feed.list.query({ cursor, limit: 20 });
      setItems(previous => [...previous, ...page.items]);
      setCursor(page.nextCursor);
      setHasMore(page.nextCursor !== undefined);
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, loading]);

  useAsyncEffect(async () => {
    await loadMore();
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (node === null) {
      return _.noop;
    }

    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting === true) {
        void loadMore();
      }
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [loadMore]);

  useAsyncEffect(async () => {
    const settings = await trpc.user.settings.get.query();
    const config = AgentAiFromSettings(settings);
    setAiConfig(config);
    setTypeWriterSpeed(settings.typeWriterSpeed);
  }, []);

  const go = useGo();

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
