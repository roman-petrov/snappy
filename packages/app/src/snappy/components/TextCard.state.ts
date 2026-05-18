import type { MenuAction } from "@snappy/ui";

import { Copy, Share } from "@snappy/platform";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { TextCardProps } from "./TextCard";

import { t } from "../../locales";

export const useTextCardState = ({
  active = false,
  ai,
  generating = false,
  html,
  model,
  onDelete,
  onError,
  onGenerated,
  prompt = ``,
}: TextCardProps) => {
  const [busy, setBusy] = useState(false);
  const autoStarted = useRef(false);
  const canRegenerate = !generating && ai !== undefined && model !== undefined && prompt.trim() !== ``;
  const empty = html.trim() === ``;
  const streaming = busy || generating;

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

  const stream = useMemo(() => {
    if (!streaming || ai === undefined || model === undefined || prompt.trim() === ``) {
      return undefined;
    }

    return (async function* textStream(): AsyncGenerator<string> {
      let next = ``;
      try {
        const session = ai.chat.completions.create({
          model,
          prompt,
          ...(generating ? { reasoningEffort: `none` } : {}),
        });
        for await (const part of session.chatText()) {
          if (part !== ``) {
            next += part;
            yield part;
          }
        }
        await session.cost();
        await Promise.resolve(onGenerated?.(next));
      } catch (error) {
        onError?.(error);
      } finally {
        if (busy) {
          setBusy(false);
        }
      }
    })();
  }, [ai, busy, generating, model, onError, onGenerated, prompt, streaming]);

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
      { icon: `content_copy`, key: `copy`, onClick: async () => Copy.html(html), tip: t(`feedCard.copy`) },
      { icon: `share`, key: `share`, onClick: async () => Share.html(html), tip: t(`feedCard.share`) },
    ];

    return onDelete === undefined
      ? base
      : [...base, { color: `error`, icon: `delete`, key: `delete`, onClick: onDelete, tip: t(`feedCard.delete`) }];
  }, [busy, canRegenerate, html, onDelete, regenerate]);

  return { actions, active, html, stream };
};
