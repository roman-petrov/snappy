import type { AgentUiProps } from "../../Types";

import { useStartState } from "./Start.state";
import { StartView } from "./Start.view";

export type StartProps = AgentUiProps<{ label: string }> & {
  disabled?: boolean;
  options: string[];
  placeholder?: string;
  selectedOptions?: string;
};

export const Start = (props: StartProps) => <StartView {...useStartState(props)} />;
