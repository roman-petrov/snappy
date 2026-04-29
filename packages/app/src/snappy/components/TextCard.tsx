import type { Ai } from "@snappy/ai";

import { useTextCardState } from "./TextCard.state";
import { TextCardView } from "./TextCard.view";

export type TextCardProps = {
  active?: boolean;
  ai?: Ai;
  html: string;
  model?: string;
  onDelete?: () => void;
  onError?: (error: unknown) => void;
  onGenerated?: (html: string) => Promise<void> | void;
  prompt?: string;
};

export const TextCard = (props: TextCardProps) => <TextCardView {...useTextCardState(props)} />;
