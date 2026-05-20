import type { Ai } from "@snappy/ai";

import { useTextCardState } from "./TextCard.state";
import { TextCardView } from "./TextCard.view";

export type TextCardProps = {
  ai?: Ai;
  generating?: boolean;
  model?: string;
  onDelete?: () => void;
  onError?: (error: unknown) => void;
  onGenerated?: (text: string) => Promise<void> | void;
  prompt?: string;
  text: string;
};

export const TextCard = (props: TextCardProps) => <TextCardView {...useTextCardState(props)} />;
