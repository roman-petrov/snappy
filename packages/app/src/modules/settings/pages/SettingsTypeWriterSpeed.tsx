import { useSettingsTypeWriterSpeedState } from "./SettingsTypeWriterSpeed.state";
import { SettingsTypeWriterSpeedView } from "./SettingsTypeWriterSpeed.view";

export const SettingsTypeWriterSpeed = () => <SettingsTypeWriterSpeedView {...useSettingsTypeWriterSpeedState()} />;
