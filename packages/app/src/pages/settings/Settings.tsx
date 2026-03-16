import { useSettingsState } from "./Settings.state";
import { SettingsView } from "./Settings.view";

export const Settings = () => <SettingsView {...useSettingsState()} />;
