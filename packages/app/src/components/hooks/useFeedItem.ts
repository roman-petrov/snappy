/* eslint-disable unicorn/try-complexity */
import type { AiChatModel, AiImageConfig, AiImageModel, AiImageSize } from "@snappy/ai";
import type { Locale } from "@snappy/intl";
import type { AgentImageEdit } from "@snappy/snappy";
import type { MenuAction } from "@snappy/ui";

import { RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import type { FeedArtifact } from "../Types";

import { t } from "../../core";
import { r } from "../../data";

export type FeedItemBindings = FeedItemNotify & {
  content: string;
  edit?: AgentImageEdit;
  id: string;
  imageConfig?: AiImageConfig;
  locale: Locale;
  model: AiChatModel | AiImageModel;
  prompt: string;
  size?: AiImageSize;
};

export type FeedItemNotify = {
  onError?: (artifactId: string, error: unknown) => void;
  onPublish?: (artifact: FeedArtifact) => void;
  onRemove?: () => void;
};

export type UseFeedItemInput = FeedItemBase;

type FeedItemBase = FeedItemBindings & { menu?: MenuAction[]; type: `image` | `text` };

export const useFeedItem = (input: UseFeedItemInput) => {
  const { create, patch, remove: removeFeed } = r.feed;
  const { content, id, menu = [], onError, onPublish, onRemove, prompt, type } = input;
  const pending = content.trim() === ``;
  const saved = id !== ``;
  const notifyError = useCallback((cause: unknown) => onError?.(id, cause), [id, onError]);

  const remove = useCallback(() => {
    void (async () => {
      if (saved) {
        await removeFeed({ id });
      }
      onRemove?.();
    })();
  }, [id, onRemove, removeFeed, saved]);

  const [busy, setBusy] = useState(false);
  const [generation, setGeneration] = useState(0);
  const ready = prompt.trim() !== ``;
  const canRegenerate = ready && !pending;
  const running = ready && (busy || pending);

  const regenerate = useCallback(() => {
    if (canRegenerate) {
      setGeneration(previous => previous + 1);
      setBusy(true);
    }
  }, [canRegenerate]);

  const complete = useCallback(
    async (value: string) => {
      try {
        const artifact = saved
          ? await patch(type === `image` ? { id, src: value, type } : { id, text: value, type })
          : await create(
              type === `image`
                ? { generationPrompt: prompt, src: value, type }
                : { generationPrompt: prompt, text: value, type },
            );
        onPublish?.(artifact);
      } catch (error) {
        notifyError(error);
      } finally {
        setBusy(false);
      }
    },
    [create, id, notifyError, onPublish, patch, prompt, saved, type],
  );

  const fail = useCallback(
    (cause: unknown) => {
      notifyError(cause);
      setBusy(false);
    },
    [notifyError],
  );

  const actions = useMemo<MenuAction[]>(
    () => [
      ...(canRegenerate
        ? [
            {
              disabled: busy,
              icon: RefreshCw,
              key: `regenerate`,
              onClick: regenerate,
              tip: t(`feedCard.regenerate`),
            } satisfies MenuAction,
          ]
        : []),
      ...menu,
      { color: `error`, icon: Trash2, key: `delete`, onClick: remove, tip: t(`feedCard.delete`) } satisfies MenuAction,
    ],
    [busy, canRegenerate, menu, regenerate, remove],
  );

  return { actions, busy, complete, fail, generation, pending, remove, running };
};
