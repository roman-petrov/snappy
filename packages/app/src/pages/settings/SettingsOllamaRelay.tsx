import { useSettingsOllamaRelayState } from "./SettingsOllamaRelay.state";
import { SettingsOllamaRelayView } from "./SettingsOllamaRelay.view";

export const SettingsOllamaRelay = () => <SettingsOllamaRelayView {...useSettingsOllamaRelayState()} />;
