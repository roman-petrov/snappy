import { useRouterGo } from "@snappy/app-router";
import { _ } from "@snappy/core";
import { useAsyncEffect } from "@snappy/ui";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { $data } from "../../../data";
import { Routes } from "../../../Routes";

export const useFeedState = () => {
  const { append, load, page } = $data.feed();
  const items = useMemo(() => page?.items ?? [], [page]);
  const hasMore = page?.hasMore ?? false;
  const aiConfig = $data.aiConfig();
  const { settings } = $data.settings();
  const typeWriterSpeed = settings?.typeWriterSpeed;
  const sentinelRef = useRef<HTMLDivElement>(null);

  useAsyncEffect(async () => {
    if ($data.feed.read() === undefined) {
      await load();
    }
  }, [load]);

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
          await append();
        } finally {
          loading = false;
        }
      })();
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [append, hasMore, items.length]);

  const go = useRouterGo();

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
            const bindings = { id: item.id, onError, prompt: item.generationPrompt };

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
    [aiConfig, items, onError, typeWriterSpeed],
  );

  return { cards, sentinelRef };
};
