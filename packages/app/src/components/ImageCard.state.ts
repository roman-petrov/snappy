/* eslint-disable unicorn/try-complexity */
import { AiConstants } from "@snappy/ai";
import { Mime } from "@snappy/core";
import { Copy, Share } from "@snappy/platform";
import { useAsyncEffect } from "@snappy/ui";
import { useRef } from "react";

import type { ImageCardProps } from "./ImageCard";

import { AgentChat } from "../modules/snappy/core";
import { useFeedItem } from "./hooks";
import { Menu } from "./Menu";

export const useImageCardState = (props: ImageCardProps) => {
  const { content, edit, imageConfig, locale, model, prompt, size } = props;

  const menu =
    content.trim() === ``
      ? []
      : Menu.copyShare({ copy: async () => Copy.image(content), share: async () => Share.image(content) });

  const { actions, busy, complete, fail, generation, pending, remove, running } = useFeedItem({
    ...props,
    menu,
    type: `image`,
  });

  const completeRef = useRef(complete);
  const failRef = useRef(fail);
  completeRef.current = complete;
  failRef.current = fail;

  useAsyncEffect(async () => {
    if (!running) {
      return;
    }

    try {
      const imagePrompt = AgentChat.prefixed(locale, prompt);
      const options = { imageConfig, prompt: imagePrompt, quality: AiConstants.defaults.imageQuality, size };

      const result =
        edit === undefined
          ? await model.generate(options)
          : await model.edit({ ...options, ...edit, images: edit.images });
      await completeRef.current(Mime.pngDataUrl(result.bytes));
    } catch (error) {
      failRef.current(error);
    }
  }, [edit, generation, imageConfig, locale, model, prompt, running, size]);

  return { actions, busy, pending, remove, running, src: content };
};
