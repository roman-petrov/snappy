import { AiConstants } from "@snappy/ai";
import { DataUrl } from "@snappy/browser";
import { Copy, Share } from "@snappy/platform";
import { type MenuAction, useAsyncEffect } from "@snappy/ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ImageCardProps } from "./ImageCard";

import { t } from "../../locales";

export const useImageCardState = ({
  ai,
  model,
  onDelete,
  onError,
  onGenerated,
  prompt = ``,
  src,
}: ImageCardProps) => {
  const [busy, setBusy] = useState(false);
  const autoStarted = useRef(false);
  const canRegenerate = ai !== undefined && model !== undefined && prompt.trim() !== ``;
  const empty = src.trim() === ``;

  const regenerate = useCallback(() => {
    if (canRegenerate) {
      setBusy(true);
    }
  }, [canRegenerate]);

  useEffect(() => {
    if (!empty) {
      autoStarted.current = false;
    }
  }, [empty]);

  useEffect(() => {
    if (!busy && empty && canRegenerate && !autoStarted.current) {
      autoStarted.current = true;
      setBusy(true);
    }
  }, [busy, canRegenerate, empty]);

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
      await Promise.resolve(onGenerated?.(DataUrl.png(result.bytes)));
    } catch (error: unknown) {
      onError?.(error);
    } finally {
      setBusy(false);
    }
  }, [ai, busy, model, onError, onGenerated, prompt]);

  const actions = useMemo<MenuAction[]>(() => {
    const base: MenuAction[] = [
      ...(canRegenerate
        ? [
            {
              disabled: busy,
              icon: `refresh`,
              key: `regenerate`,
              onClick: regenerate,
              tip: t(`feedCard.regenerate`),
            } satisfies MenuAction,
          ]
        : []),
      ...(empty
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
          ]),
    ];

    return onDelete === undefined
      ? base
      : [...base, { color: `error`, icon: `delete`, key: `delete`, onClick: onDelete, tip: t(`feedCard.delete`) }];
  }, [busy, canRegenerate, empty, onDelete, regenerate, src]);

  return { actions, busy, empty, emptyText: t(`feedCard.generatingImage`), src };
};
