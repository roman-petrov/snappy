import { useSettingsProfileState } from "./SettingsProfile.state";
import { SettingsProfileView } from "./SettingsProfile.view";

export const SettingsProfile = () => <SettingsProfileView {...useSettingsProfileState()} />;
