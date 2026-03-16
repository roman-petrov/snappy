import { useSettingsLanguageState } from "./SettingsLanguage.state";
import { SettingsLanguageView } from "./SettingsLanguage.view";

export const SettingsLanguage = () => <SettingsLanguageView {...useSettingsLanguageState()} />;
