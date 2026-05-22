import type { AiStreamProps, AiStreamTextProps } from "@snappy/ai-stream";
import type { MenuAction } from "@snappy/ui";

import { useFeedStreamCardState } from "./FeedStreamCard.state";
import { FeedStreamCardView } from "./FeedStreamCard.view";

export type FeedStreamCardContentProps =
  | (AiStreamProps & { running?: boolean; text?: never })
  | (AiStreamTextProps & { active?: never; running?: never; stream?: never });

export type FeedStreamCardProps = FeedStreamCardContentProps & {
  artifactActions?: MenuAction[];
  onRemove?: () => Promise<void> | void;
};

export const FeedStreamCard = (props: FeedStreamCardProps) => <FeedStreamCardView {...useFeedStreamCardState(props)} />;
