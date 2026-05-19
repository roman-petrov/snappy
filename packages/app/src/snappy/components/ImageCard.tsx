import type { Ai } from "@snappy/ai";

import { useImageCardState } from "./ImageCard.state";
import { ImageCardView } from "./ImageCard.view";

export type ImageCardProps = {
  ai?: Ai;
  model?: string;
  onDelete?: () => void;
  onError?: (error: unknown) => void;
  onGenerated?: (src: string) => Promise<void> | void;
  prompt?: string;
  src: string;
};

export const ImageCard = (props: ImageCardProps) => <ImageCardView {...useImageCardState(props)} />;
