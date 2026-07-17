import { useRouterGo } from "@snappy/app-router";
import { _ } from "@snappy/core";
import { Language } from "@snappy/ui";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { AgentAiFromSettings } from "../../../core";
import { r } from "../../../data";
import { Routes } from "../../../Routes";

export const useFeedState = () => {
  const { append, hasMore, items } = r.feed();
  const [settings] = r.settings();
  const aiConfig = settings === undefined ? undefined : AgentAiFromSettings(settings);
  const typeWriterSpeed = settings?.typeWriterSpeed;
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  const cards = useMemo(() => {
    if (aiConfig === undefined) {
      return undefined;
    }

    const locale = Language.locale();

    return items.map(item => {
      const bindings = { id: item.id, locale, onError, prompt: item.generationPrompt };

      return item.type === `image`
        ? { ...bindings, content: item.src, model: aiConfig.models.image, type: `image` as const }
        : { ...bindings, content: item.text, model: aiConfig.models.chat, type: `text` as const, typeWriterSpeed };
    });
  }, [aiConfig, items, onError, typeWriterSpeed]);

  return { cards, sentinelRef };
};
