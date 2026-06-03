import type { Ai, AiOptions } from "@snappy/ai";
import type { MenuAction } from "@snappy/ui";

import { RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { t } from "../../locales";
import { ChatFeed } from "../../pages/feed/ChatFeed";

export type FeedItemBindings = FeedItemNotify & {
  ai: Ai;
  aiOptions: AiOptions;
  content: string;
  id: string;
  model: string;
  prompt: string;
};

export type FeedItemNotify = {
  onError?: (artifactId: string, error: unknown) => void;
  onPublish?: (artifactId: string) => void;
  onRemove?: (artifactId: string) => void;
};

export type UseFeedItemInput = FeedItemBase;

type FeedItemBase = FeedItemBindings & { menu?: MenuAction[]; saveField: `src` | `text` };

export const useFeedItem = (input: UseFeedItemInput) => {
  const { content, id, menu = [], onError, onPublish, onRemove, prompt, saveField } = input;
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
      await publish(value);
      setBusy(false);
    },
    [publish],
  );

  const fail = useCallback(
    (cause: unknown) => {
      error(cause);
      setBusy(false);
    },
    [error],
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
