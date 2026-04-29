import { useStartState } from "./Start.state";
import { StartView } from "./Start.view";

export type StartProps = {
  disabled?: boolean;
  onCancel: () => void;
  onStart: (label: string) => void;
  options: string[];
  placeholder?: string;
  selectedOptions?: string;
};

export const Start = (props: StartProps) => <StartView {...useStartState(props)} />;
