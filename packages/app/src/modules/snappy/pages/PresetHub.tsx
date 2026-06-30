import { usePresetHubState } from "./PresetHub.state";
import { PresetHubView } from "./PresetHub.view";

export type PresetHubProps = { presetId: string };

export const PresetHub = (props: PresetHubProps) => <PresetHubView {...usePresetHubState(props)} />;
