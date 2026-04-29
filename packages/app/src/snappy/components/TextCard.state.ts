import type { MenuAction } from "@snappy/ui";

import { Clipboard, Share } from "@snappy/browser";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { TextCardProps } from "./TextCard";

import { t } from "../../locales";

export const useTextCardState = ({
  active = false,
  ai,
  html,
  model,
  onDelete,
  onError,
  onGenerated,
  prompt = ``,
}: TextCardProps) => {
  const [busy, setBusy] = useState(false);
  const autoStarted = useRef(false);
  const canRegenerate = ai !== undefined && model !== undefined && prompt.trim() !== ``;
  const empty = html.trim() === ``;

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

  const stripHtml = (value: string) =>
    value
      .replaceAll(/<[^<>]*>/gu, ` `)
      .replaceAll(/\s+/gu, ` `)
      .trim();

  const onShare = useCallback(async () => {
    const text = stripHtml(html);
    await Share.text(text);
  }, [html]);

  const stream = useMemo(() => {
    if (!busy || ai === undefined || model === undefined || prompt.trim() === ``) {
      return undefined;
    }

    return (async function* textStream(): AsyncGenerator<string> {
      let next = ``;
      try {
        const session = ai.chat.completions.create({ model, prompt });
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
        setBusy(false);
      }
    })();
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
      { icon: `content_copy`, key: `copy`, onClick: async () => Clipboard.copyHtml(html), tip: t(`feedCard.copy`) },
      { icon: `share`, key: `share`, onClick: onShare, tip: t(`feedCard.share`) },
    ];

    return onDelete === undefined
      ? base
      : [...base, { color: `error`, icon: `delete`, key: `delete`, onClick: onDelete, tip: t(`feedCard.delete`) }];
  }, [busy, canRegenerate, html, onDelete, onShare, regenerate]);

  return { actions, active, busy, html, stream };
};
