import { usePresetPickerState } from "./PresetPicker.state";
import { PresetPickerView } from "./PresetPicker.view";

export type PresetPickerProps = { presetId: string };

export const PresetPicker = (props: PresetPickerProps) => <PresetPickerView {...usePresetPickerState(props)} />;
