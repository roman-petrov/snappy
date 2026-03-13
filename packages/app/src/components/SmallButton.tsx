import { useSmallButtonState } from "./SmallButton.state";
import { SmallButtonView } from "./SmallButton.view";

export type SmallButtonProps = {
  compact?: boolean;
  disabled?: boolean;
  full?: boolean;
  icon: string;
  label?: string;
  onClick: () => void;
  title: string;
  variant: `copy` | `neutral`;
};

export const SmallButton = (props: SmallButtonProps) => <SmallButtonView {...useSmallButtonState(props)} />;
