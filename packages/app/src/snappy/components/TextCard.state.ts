import type { MenuAction } from "@snappy/ui";

import { Copy, Share } from "@snappy/platform";
import { useCallback, useMemo, useRef } from "react";

import type { TextCardProps } from "./TextCard";

import { t } from "../../locales";
import { useFeedCardGeneration } from "../hooks";

export const useTextCardState = ({
  ai,
  generating = false,
  model,
  onDelete,
  onError,
  onGenerated,
  prompt = ``,
  text,
}: TextCardProps) => {
  const copyHtml = useRef(``);
  const canRegenerate = !generating && ai !== undefined && model !== undefined && prompt.trim() !== ``;
  const empty = text.trim() === ``;

  const extraActions = useMemo<MenuAction[]>(
    () => [
      { icon: `content_copy`, key: `copy`, onClick: async () => Copy.html(copyHtml.current), tip: t(`feedCard.copy`) },
      { icon: `share`, key: `share`, onClick: async () => Share.html(copyHtml.current), tip: t(`feedCard.share`) },
    ],
    [],
  );

  const { actions, busy, onErrorRef, onGeneratedRef, setBusy } = useFeedCardGeneration({
    canRegenerate,
    empty,
    extraActions,
    onDelete,
    onError,
    onGenerated,
  });

  const streaming = busy || generating;

  const stream = useMemo((): AsyncIterable<string> | undefined => {
    if (!streaming || ai === undefined || model === undefined || prompt.trim() === ``) {
      return undefined;
    }

    return (async function* textStream(): AsyncGenerator<string> {
      let next = ``;
      try {
        const session = ai.chat.completions.create({ model, prompt, reasoningEffort: `none` });
        for await (const part of session.chatText()) {
          if (part !== ``) {
            next += part;
            yield part;
          }
        }
        await Promise.resolve(onGeneratedRef.current?.(next));
      } catch (error) {
        onErrorRef.current?.(error);
      } finally {
        if (busy) {
          setBusy(false);
        }
      }
    })();
  }, [ai, busy, model, onErrorRef, onGeneratedRef, prompt, setBusy, streaming]);

  const content = stream ?? text;

  const onHtml = useCallback((htmlText: string) => {
    copyHtml.current = htmlText;
  }, []);

  return { actions, content, onHtml };
};
