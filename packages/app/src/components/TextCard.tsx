import type { AiChatModel } from "@snappy/ai";
import type { TypeWriterSpeed } from "@snappy/domain";

import type { FeedItemBindings } from "./hooks";

import { useTextCardState } from "./TextCard.state";
import { TextCardView } from "./TextCard.view";

export type TextCardProps = Omit<FeedItemBindings, `model`> & { model: AiChatModel; typeWriterSpeed?: TypeWriterSpeed };

export const TextCard = (props: TextCardProps) => <TextCardView {...useTextCardState(props)} />;
