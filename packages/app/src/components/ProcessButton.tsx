import { useProcessButtonState } from "./ProcessButton.state";
import { ProcessButtonView } from "./ProcessButton.view";

export type ProcessButtonProps = {
  compact?: boolean;
  disabled?: boolean;
  disabledEmpty?: boolean;
  loading?: boolean;
  text: string;
};

export const ProcessButton = (props: ProcessButtonProps) => <ProcessButtonView {...useProcessButtonState(props)} />;
