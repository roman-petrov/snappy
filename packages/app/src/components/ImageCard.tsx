import type { AiImageModel } from "@snappy/ai";

import type { FeedItemBindings } from "./hooks";

import { useImageCardState } from "./ImageCard.state";
import { ImageCardView } from "./ImageCard.view";

export type ImageCardProps = Omit<FeedItemBindings, `model`> & { model: AiImageModel };

export const ImageCard = (props: ImageCardProps) => <ImageCardView {...useImageCardState(props)} />;
