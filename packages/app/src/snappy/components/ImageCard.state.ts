import { AiConstants } from "@snappy/ai";
import { DataUrl } from "@snappy/browser";
import { Copy, Share } from "@snappy/platform";
import { type MenuAction, useAsyncEffect } from "@snappy/ui";
import { useMemo } from "react";

import type { ImageCardProps } from "./ImageCard";

import { t } from "../../locales";
import { useFeedCardGeneration } from "../hooks";

export const useImageCardState = ({ ai, model, onDelete, onError, onGenerated, prompt = ``, src }: ImageCardProps) => {
  const canRegenerate = ai !== undefined && model !== undefined && prompt.trim() !== ``;
  const empty = src.trim() === ``;

  const extraActions = useMemo<MenuAction[]>(
    () =>
      empty
        ? []
        : [
            {
              icon: `content_copy`,
              key: `copy`,
              onClick: async () => Copy.image(src),
              tip: t(`feedCard.copy`),
            } satisfies MenuAction,
            {
              icon: `share`,
              key: `share`,
              onClick: async () => Share.image(src),
              tip: t(`feedCard.share`),
            } satisfies MenuAction,
          ],
    [empty, src],
  );

  const { actions, busy, onErrorRef, onGeneratedRef, setBusy } = useFeedCardGeneration({
    canRegenerate,
    empty,
    extraActions,
    onDelete,
    onError,
    onGenerated,
  });

  useAsyncEffect(async () => {
    if (!busy || ai === undefined || model === undefined || prompt.trim() === ``) {
      return;
    }
    try {
      const result = await ai.images.generate({
        model,
        prompt,
        quality: AiConstants.defaults.imageQuality,
        size: `1024x1024`,
      });
      await Promise.resolve(onGeneratedRef.current?.(DataUrl.png(result.bytes)));
    } catch (error: unknown) {
      onErrorRef.current?.(error);
    } finally {
      setBusy(false);
    }
  }, [ai, busy, model, prompt]);

  return { actions, busy, empty, emptyText: t(`feedCard.generatingImage`), src };
};
