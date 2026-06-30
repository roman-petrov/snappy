import { Markdown } from "@snappy/ai-stream";
import { Html } from "@snappy/browser";
import { Copy, Share } from "@snappy/platform";
import { useCallback, useEffect, useRef } from "react";

import type { FeedStreamCardContentProps, FeedStreamCardProps } from "./FeedStreamCard";

import { Menu } from "./Menu";

type FeedStreamCardStream = Extract<FeedStreamCardContentProps, { text?: never }>;

const isStream = (props: FeedStreamCardContentProps): props is FeedStreamCardStream =>
  props.running === true || props.active === true || props.stream !== undefined;

export const useFeedStreamCardState = ({ artifactActions, onRemove, ...content }: FeedStreamCardProps) => {
  const copyText = useRef(``);
  const text = `text` in content ? content.text : undefined;
  const parentComplete = `onComplete` in content ? content.onComplete : undefined;

  const copyShareActions = Menu.copyShare({
    copy: async () => Copy.html(Html.sanitize(Markdown.html(copyText.current))),
    share: async () => Share.html(Html.sanitize(Markdown.html(copyText.current))),
  });

  useEffect(() => {
    if (!isStream(content) && text !== undefined) {
      copyText.current = text;
    }
  }, [content, text]);

  const onComplete = useCallback(
    (value: string) => {
      copyText.current = value;
      parentComplete?.(value);
    },
    [parentComplete],
  );

  const actions = artifactActions === undefined ? copyShareActions : [...copyShareActions, ...artifactActions];

  return isStream(content)
    ? { actions, onComplete, onRemove, streaming: true as const, streamProps: content }
    : { actions, onRemove, streaming: false as const, textProps: content };
};
