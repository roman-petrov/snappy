import { AiStream } from "@snappy/ai-stream";

import type { useTextCardState } from "./TextCard.state";

import { FeedCard } from "./FeedCard";

export type TextCardViewProps = ReturnType<typeof useTextCardState>;

export const TextCardView = ({ actions, active, content, onHtml }: TextCardViewProps) => (
  <FeedCard actions={actions} active={active}>
    <AiStream onHtml={onHtml} stream={content} />
  </FeedCard>
);
