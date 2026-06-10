import { AiConstants } from "@snappy/ai";
import { DataUrl } from "@snappy/browser";
import { Copy, Share } from "@snappy/platform";
import { useAsyncEffect } from "@snappy/ui";

import type { ImageCardProps } from "./ImageCard";

import { Menu } from "../core";
import { useFeedItem } from "../hooks";

export const useImageCardState = (props: ImageCardProps) => {
  const { ai, content, model, prompt } = props;

  const menu =
    content.trim() === ``
      ? []
      : Menu.copyShare({ copy: async () => Copy.image(content), share: async () => Share.image(content) });

  const { actions, busy, complete, fail, generation, pending, remove, running } = useFeedItem({
    ...props,
    menu,
    type: `image`,
  });

  useAsyncEffect(async () => {
    if (!running) {
      return;
    }

    try {
      const result = await ai.images.generate({
        model,
        prompt,
        quality: AiConstants.defaults.imageQuality,
        size: `1024x1024`,
      });
      await complete(DataUrl.png(result.bytes));
    } catch (error) {
      fail(error);
    }
  }, [ai, complete, fail, generation, model, prompt, running]);

  return { actions, busy, pending, remove, src: content };
};
