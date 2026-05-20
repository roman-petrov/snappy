import { AiStream } from "@snappy/ai-stream";

import type { useTextCardState } from "./TextCard.state";

import { FeedCard } from "./FeedCard";

export type TextCardViewProps = ReturnType<typeof useTextCardState>;

export const TextCardView = ({ actions, content, onHtml, remove }: TextCardViewProps) => (
  <FeedCard actions={actions} onRemove={remove}>
    <AiStream onHtml={onHtml} stream={content} />
  </FeedCard>
);
