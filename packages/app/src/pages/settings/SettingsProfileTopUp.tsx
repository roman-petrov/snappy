import { useSettingsProfileTopUpState } from "./SettingsProfileTopUp.state";
import { SettingsProfileTopUpView } from "./SettingsProfileTopUp.view";

export const SettingsProfileTopUp = () => <SettingsProfileTopUpView {...useSettingsProfileTopUpState()} />;
