import type { MenuAction } from "@snappy/ui";

import { AiConstants } from "@snappy/ai";
import { DataUrl } from "@snappy/browser";
import { Copy, Share } from "@snappy/platform";
import { useMemo } from "react";

import type { ImageCardProps } from "./ImageCard";

import { t } from "../../locales";
import { type FeedItemContext, useFeedItem } from "../hooks";

export const useImageCardState = (props: ImageCardProps) => {
  const { content } = props;

  const menu = useMemo<MenuAction[]>(
    () =>
      content.trim() === ``
        ? []
        : [
            {
              icon: `content_copy`,
              key: `copy`,
              onClick: async () => Copy.image(content),
              tip: t(`feedCard.copy`),
            } satisfies MenuAction,
            {
              icon: `share`,
              key: `share`,
              onClick: async () => Share.image(content),
              tip: t(`feedCard.share`),
            } satisfies MenuAction,
          ],
    [content],
  );

  const run = async ({ ai: client, model: imageModel, prompt: imagePrompt }: FeedItemContext) => {
    const result = await client.images.generate({
      model: imageModel,
      prompt: imagePrompt,
      quality: AiConstants.defaults.imageQuality,
      size: `1024x1024`,
    });

    return DataUrl.png(result.bytes);
  };

  const { actions, busy, pending, remove } = useFeedItem({ ...props, menu, run, saveField: `src` });

  return { actions, busy, pending, remove, src: content };
};
