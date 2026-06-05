import { useSettingsProfilePasswordState } from "./SettingsProfilePassword.state";
import { SettingsProfilePasswordView } from "./SettingsProfilePassword.view";

export const SettingsProfilePassword = () => <SettingsProfilePasswordView {...useSettingsProfilePasswordState()} />;
