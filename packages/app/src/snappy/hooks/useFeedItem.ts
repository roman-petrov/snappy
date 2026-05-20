import type { Ai } from "@snappy/ai";

import { type MenuAction, useAsyncEffect } from "@snappy/ui";
import { useCallback, useMemo, useRef, useState } from "react";

import { t } from "../../locales";
import { ChatFeed } from "../../pages/feed/ChatFeed";

export type FeedItemBindings = FeedItemNotify & { ai: Ai; content: string; id: string; model: string; prompt: string };

export type FeedItemContext = { ai: Ai; model: string; prompt: string };

export type FeedItemNotify = {
  onError?: (artifactId: string, error: unknown) => void;
  onPublish?: (artifactId: string) => void;
  onRemove?: (artifactId: string) => void;
};

export type UseFeedItemInput = FeedItemBindings & {
  menu?: MenuAction[];
  run: (input: FeedItemContext) => Promise<string>;
  saveField: `src` | `text`;
};

export const useFeedItem = ({
  ai,
  content,
  id,
  menu = [],
  model,
  onError,
  onPublish,
  onRemove,
  prompt,
  run,
  saveField,
}: UseFeedItemInput) => {
  const pending = content.trim() === ``;

  const save = useCallback(
    async (value: string) => ChatFeed.patch(id, saveField === `src` ? { src: value } : { text: value }),
    [id, saveField],
  );

  const error = useCallback((cause: unknown) => onError?.(id, cause), [id, onError]);

  const publish = useCallback(
    async (value: string) => {
      await save(value);
      onPublish?.(id);
    },
    [id, onPublish, save],
  );

  const remove = useCallback(() => {
    void (async () => {
      await ChatFeed.remove(id);
      onRemove?.(id);
    })();
  }, [id, onRemove]);

  const handlers = useRef({ error, publish, run });
  handlers.current = { error, publish, run };

  const [busy, setBusy] = useState(false);
  const ready = prompt.trim() !== ``;
  const canRegenerate = ready && !pending;
  const running = ready && (busy || pending);

  const regenerate = useCallback(() => {
    if (canRegenerate) {
      setBusy(true);
    }
  }, [canRegenerate]);

  const context = useMemo((): FeedItemContext | undefined => {
    if (!running) {
      return undefined;
    }

    return { ai, model, prompt };
  }, [ai, model, prompt, running]);

  useAsyncEffect(async () => {
    if (context === undefined) {
      return;
    }
    const { current } = handlers;
    try {
      await current.publish(await current.run(context));
    } catch (error_) {
      current.error(error_);
    } finally {
      if (busy) {
        setBusy(false);
      }
    }
  }, [busy, context]);

  const actions = useMemo<MenuAction[]>(
    () => [
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
      ...menu,
      {
        color: `error`,
        icon: `delete`,
        key: `delete`,
        onClick: remove,
        tip: t(`feedCard.delete`),
      } satisfies MenuAction,
    ],
    [busy, canRegenerate, menu, regenerate, remove],
  );

  return { actions, busy, pending, remove, running };
};
