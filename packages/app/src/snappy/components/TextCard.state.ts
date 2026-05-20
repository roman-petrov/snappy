import type { AiChatCompletionSession } from "@snappy/ai";
import type { MenuAction } from "@snappy/ui";

import { Copy, Share } from "@snappy/platform";
import { useMemo, useRef } from "react";

import type { TextCardProps } from "./TextCard";

import { t } from "../../locales";
import { useFeedItem } from "../hooks";

export const useTextCardState = (props: TextCardProps) => {
  const { ai, content, model, prompt } = props;
  const copyHtml = useRef(``);
  const sessionRef = useRef<AiChatCompletionSession | undefined>(undefined);

  const menu = useMemo<MenuAction[]>(
    () => [
      { icon: `content_copy`, key: `copy`, onClick: async () => Copy.html(copyHtml.current), tip: t(`feedCard.copy`) },
      { icon: `share`, key: `share`, onClick: async () => Share.html(copyHtml.current), tip: t(`feedCard.share`) },
    ],
    [],
  );

  const onHtml = (htmlText: string) => (copyHtml.current = htmlText);

  const run = async () => {
    const { current } = sessionRef;

    return current === undefined ? `` : (await current.assistant()).content;
  };

  const { actions, remove, running } = useFeedItem({ ...props, menu, run, saveField: `text` });

  const displayContent = useMemo(() => {
    if (!running) {
      sessionRef.current = undefined;

      return content;
    }

    const session = ai.chat.completions.create({ model, prompt, reasoningEffort: `none` });
    sessionRef.current = session;

    return session.chatText();
  }, [ai, content, model, prompt, running]);

  return { actions, content: displayContent, onHtml, remove };
};
