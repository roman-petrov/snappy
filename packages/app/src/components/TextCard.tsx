import { useTextCardState } from "./TextCard.state";
import { TextCardView } from "./TextCard.view";

export type TextCardProps = {
  compact?: boolean;
  loading: boolean;
  onTextChange: (value: string) => void;
  result: string;
  showResult: boolean;
  text: string;
};

export const TextCard = (props: TextCardProps) => <TextCardView {...useTextCardState(props)} />;
