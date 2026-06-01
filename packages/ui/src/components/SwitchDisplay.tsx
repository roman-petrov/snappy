import { useSwitchDisplayState } from "./SwitchDisplay.state";
import { SwitchDisplayView } from "./SwitchDisplay.view";

export type SwitchDisplayProps = { checked?: boolean; disabled?: boolean };

export const SwitchDisplay = (props: SwitchDisplayProps) => <SwitchDisplayView {...useSwitchDisplayState(props)} />;
