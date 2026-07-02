/* eslint-disable unicorn/try-complexity */
import { AiConstants } from "@snappy/ai";
import { Mime } from "@snappy/core";
import { Copy, Share } from "@snappy/platform";
import { useAsyncEffect } from "@snappy/ui";

import type { ImageCardProps } from "./ImageCard";

import { AgentChat } from "../modules/snappy/core";
import { useFeedItem } from "./hooks";
import { Menu } from "./Menu";

export const useImageCardState = (props: ImageCardProps) => {
  const { content, edit, locale, model, prompt, size } = props;

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
      const imageSize = size ?? `1024x1024`;
      const imagePrompt = AgentChat.prefixed(locale, prompt);

      const result =
        edit === undefined
          ? await model.generate({ prompt: imagePrompt, quality: AiConstants.defaults.imageQuality, size: imageSize })
          : await model.edit({
              background: edit.background,
              images: edit.images,
              prompt: imagePrompt,
              quality: AiConstants.defaults.imageQuality,
              size: imageSize,
            });
      await complete(Mime.pngDataUrl(result.bytes));
    } catch (error) {
      fail(error);
    }
  }, [complete, edit, fail, generation, locale, model, prompt, running, size]);

  return { actions, busy, pending, remove, running, src: content };
};
