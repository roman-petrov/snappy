import type { useTextCardState } from "./TextCard.state";

import { FeedStreamCard } from "./FeedStreamCard";

export type TextCardViewProps = ReturnType<typeof useTextCardState>;

export const TextCardView = (props: TextCardViewProps) => <FeedStreamCard {...props} />;
