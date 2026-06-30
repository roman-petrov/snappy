import { AiStream, AiStreamText } from "@snappy/ai-stream";
import { _ } from "@snappy/core";

import type { useFeedStreamCardState } from "./FeedStreamCard.state";

import { FeedCard } from "./FeedCard";

export type FeedStreamCardViewProps = ReturnType<typeof useFeedStreamCardState>;

export const FeedStreamCardView = ({
  actions,
  onComplete,
  onRemove,
  streaming,
  streamProps,
  textProps,
}: FeedStreamCardViewProps) => (
  <FeedCard actions={actions} onRemove={onRemove ?? _.noop}>
    {streaming ? <AiStream {...streamProps} onComplete={onComplete} /> : <AiStreamText {...textProps} />}
  </FeedCard>
);
