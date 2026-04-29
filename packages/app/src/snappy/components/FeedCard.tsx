import type { MenuAction } from "@snappy/ui";
import type { ReactNode } from "react";

import { useFeedCardState } from "./FeedCard.state";
import { FeedCardView } from "./FeedCard.view";

export type FeedCardProps = { actions?: MenuAction[]; active?: boolean; children: ReactNode };

export const FeedCard = (props: FeedCardProps) => <FeedCardView {...useFeedCardState(props)} />;
