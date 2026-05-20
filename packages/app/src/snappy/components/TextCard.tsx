import type { FeedItemBindings } from "../hooks";

import { useTextCardState } from "./TextCard.state";
import { TextCardView } from "./TextCard.view";

export type TextCardProps = FeedItemBindings;

export const TextCard = (props: TextCardProps) => <TextCardView {...useTextCardState(props)} />;
