import type { FeedItemBindings } from "../hooks";

import { useImageCardState } from "./ImageCard.state";
import { ImageCardView } from "./ImageCard.view";

export type ImageCardProps = FeedItemBindings;

export const ImageCard = (props: ImageCardProps) => <ImageCardView {...useImageCardState(props)} />;
