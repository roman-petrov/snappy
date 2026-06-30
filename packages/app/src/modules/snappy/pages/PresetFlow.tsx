import { usePresetFlowState } from "./PresetFlow.state";
import { PresetFlowView } from "./PresetFlow.view";

export type PresetFlowProps = { flowId: string; presetId: string };

export const PresetFlow = (props: PresetFlowProps) => <PresetFlowView {...usePresetFlowState(props)} />;
